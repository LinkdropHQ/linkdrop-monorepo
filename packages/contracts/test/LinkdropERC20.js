/* global describe, before, it */

import chai from 'chai'
import { ethers } from 'ethers'
import { AddressZero } from 'ethers/constants'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import LinkdropFactory from '../build/LinkdropFactory.json'
import LinkdropMastercopy from '../build/LinkdropMastercopy.json'
import TokenMock from '../build/TokenMock.json'

import {
  computeProxyAddress,
  createLink,
  signReceiverAddress,
  computeBytecode,
  LinkParams
} from '../scripts/utils'

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

chai.use(solidity)
const { expect } = chai

const provider = createMockProvider()

const [sender, receiver, nonsender, signer] = getWallets(provider)

let masterCopy
let factory
let proxy
let proxyAddress
let tokenInstance

let link
let receiverAddress
let receiverSignature

const campaignId = 0
const expiration = 99999999999
const feeToken = AddressZero // Native token
const feeAmount = 2e15
const feeReceiver = AddressZero // So that tx.origin will get fee
const tokensAmount = 100

const initcode = '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
const version = 1
const chainId = 4 // Rinkeby

describe('ERC20 Linkdrop Tests', () => {
  before(async () => {
    tokenInstance = await deployContract(sender, TokenMock)
  })

  it('should deploy master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(sender, LinkdropMastercopy, [], {
      gasLimit: 6000000
    })
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
  })

  it('should deploy factory', async () => {
    // bytecode = computeBytecode(masterCopy.address)
    factory = await deployContract(
      sender,
      LinkdropFactory,
      [masterCopy.address, chainId],
      {
        gasLimit: 6000000
      }
    )

    expect(factory.address).to.not.eq(ethers.constants.AddressZero)
    const version = await factory.masterCopyVersion()
    expect(version).to.eq(1)
  })

  it('should deploy proxy and delegate to implementation', async () => {
    proxyAddress = computeProxyAddress(
      factory.address,
      sender.address,
      campaignId,
      initcode
    )

    await expect(
      factory.deployProxy(campaignId, {
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(proxyAddress, LinkdropMastercopy.abi, sender)

    const senderAddress = await proxy.sender()
    expect(senderAddress).to.eq(sender.address)

    const version = await proxy.version()
    expect(version).to.eq(1)

    const owner = await proxy.owner()
    expect(owner).to.eq(factory.address)

    await sender.sendTransaction({
      to: proxy.address,
      value: ethers.utils.parseEther('2')
    })
  })

  it('sender should be able to add new signing keys', async () => {
    let isSigner = await proxy.isSigner(signer.address)
    expect(isSigner).to.eq(false)
    await proxy.addSigner(signer.address, { gasLimit: 500000 })
    isSigner = await proxy.isSigner(signer.address)
    expect(isSigner).to.eq(true)

    await proxy.addSigner(receiver.address, { gasLimit: 500000 })
  })

  it('non sender should not be able to remove signing key', async () => {
    proxy = proxy.connect(nonsender)

    let isSigner = await proxy.isSigner(receiver.address)
    expect(isSigner).to.eq(true)

    await expect(
      proxy.removeSigner(receiver.address, { gasLimit: 500000 })
    ).to.be.revertedWith('ONLY_SENDER')
    isSigner = await proxy.isSigner(receiver.address)
    expect(isSigner).to.eq(true)
  })

  it('sender should be able to remove signing key', async () => {
    proxy = proxy.connect(sender)

    let isSigner = await proxy.isSigner(receiver.address)
    expect(isSigner).to.eq(true)

    await proxy.removeSigner(receiver.address, { gasLimit: 500000 })

    isSigner = await proxy.isSigner(receiver.address)
    expect(isSigner).to.eq(false)
  })

  it('should revert while checking claim params with insufficient allowance', async () => {
    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount: 100,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.checkClaimParams(
        link.linkParams,
        receiverAddress,
        receiverSignature,
        sender.address,
        campaignId
      )
    ).to.be.revertedWith('INSUFFICIENT_TOKENS_ALLOWANCE')
  })

  it("should verify link signer's signature", async () => {
    expect(await proxy.verifySignerSignature(link.linkParams)).to.be.true
  })

  it("should verify receiver's signature", async () => {
    const isValid = await proxy.verifyReceiverSignature(
      link.linkId,
      receiverAddress,
      receiverSignature
    )

    expect(isValid).to.be.true
  })

  it('non-sender should not be able to pause contract', async () => {
    proxy = proxy.connect(nonsender)
    // Trying to pause
    await expect(proxy.pause({ gasLimit: 500000 })).to.be.revertedWith(
      'ONLY_SENDER'
    )
  })

  it('sender should be able to pause contract', async () => {
    proxy = proxy.connect(sender)
    // Pausing
    await proxy.pause({ gasLimit: 500000 })
    const paused = await proxy.paused()
    expect(paused).to.eq(true)
  })

  it('sender should be able to unpause contract', async () => {
    // Unpausing
    await proxy.unpause({ gasLimit: 500000 })
    const paused = await proxy.paused()
    expect(paused).to.eq(false)
  })

  it('sender should be able to cancel link', async () => {
    await expect(
      proxy.cancel(link.linkParams.linkId, { gasLimit: 200000 })
    ).to.emit(proxy, 'Canceled')
    const canceled = await proxy.isCanceledLink(link.linkId)
    expect(canceled).to.eq(true)
  })

  it('should fail to claim tokens when paused', async () => {
    // Pausing
    await proxy.pause({ gasLimit: 500000 })

    await expect(
      factory.checkClaimParams(
        link.linkParams,
        receiverAddress,
        receiverSignature,
        sender.address,
        campaignId
      )
    ).to.be.revertedWith('LINKDROP_PROXY_CONTRACT_PAUSED')
  })

  it('should fail to claim with insufficient allowance', async () => {
    // Unpause
    await proxy.unpause({ gasLimit: 500000 })

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 500000
      })
    ).to.be.revertedWith('INSUFFICIENT_TOKENS_ALLOWANCE')
  })

  it('should fail to claim expired link', async () => {
    await tokenInstance.approve(proxy.address, tokensAmount)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount,
      feeAmount,
      expiration: 420, // INVALID EXPIRATION TIMESTAMP
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        link.linkParams,
        receiverAddress,
        receiverSignature,
        sender.address,
        campaignId,
        {
          gasLimit: 500000
        }
      )
    ).to.be.revertedWith('LINK_EXPIRED')
  })

  it('should fail to claim with invalid contract version', async () => {
    await tokenInstance.approve(proxy.address, tokensAmount)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount,
      feeAmount,
      expiration,
      version: 420, // INVALID VERSION
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 500000
      })
    ).to.be.revertedWith('INVALID_SIGNER_SIGNATURE')
  })

  it('should fail to claim with invalid chain id', async () => {
    await tokenInstance.approve(proxy.address, tokensAmount)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount,
      feeAmount,
      expiration,
      version,
      chainId: 420, // INVALID CHAIN ID
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 500000
      })
    ).to.be.revertedWith('INVALID_SIGNER_SIGNATURE')
  })

  it('should succesfully claim tokens with valid claim params', async () => {
    await tokenInstance.approve(proxy.address, tokensAmount)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    const senderBalanceBefore = await tokenInstance.balanceOf(sender.address)

    await proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
      gasLimit: 800000
    })

    const senderBalanceAfter = await tokenInstance.balanceOf(sender.address)
    expect(senderBalanceAfter).to.eq(senderBalanceBefore.sub(tokensAmount))

    const receiverBalance = await tokenInstance.balanceOf(receiverAddress)
    expect(receiverBalance).to.eq(tokensAmount)
  })

  it('should be able to check link claimed from factory instance', async () => {
    const claimed = await factory.isClaimedLink(
      sender.address,
      campaignId,
      link.linkParams.linkId
    )
    expect(claimed).to.eq(true)
  })

  it('should fail to claim link twice', async () => {
    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 500000
      })
    ).to.be.revertedWith('LINK_CLAIMED')
  })

  it('should fail to claim unavailable amount of tokens', async () => {
    await tokenInstance.approve(proxy.address, 100)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount: 10000000, // UNAVAILABLE AMOUNT FOR SENDER
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 800000
      })
    ).to.be.revertedWith('INSUFFICIENT_TOKENS')
  })

  it('should fail to claim tokens with fake signer signature', async () => {
    await tokenInstance.approve(proxy.address, tokensAmount)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: nonsender // INVALID SIGNING KEY FOR LINKDROP PROXY CONTRACT
    })

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 500000
      })
    ).to.be.revertedWith('INVALID_SIGNER_SIGNATURE')
  })

  it('should fail to claim tokens with fake receiver signature', async () => {
    await tokenInstance.approve(proxy.address, tokensAmount)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })

    const fakeLink = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount: 100,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(
      fakeLink.linkKey,
      receiverAddress
    )

    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 500000
      })
    ).to.be.revertedWith('INVALID_RECEIVER_SIGNATURE')
  })

  it('should fail to claim canceled link', async () => {
    await tokenInstance.approve(proxy.address, tokensAmount)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 0,
      tokensAmount,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await proxy.cancel(link.linkId, { gasLimit: 100000 })

    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 500000
      })
    ).to.be.revertedWith('LINK_CANCELED')
  })

  it('should be able to get balance and send ethers to proxy', async () => {
    const balanceBefore = await provider.getBalance(proxy.address)

    const value = ethers.utils.parseEther('2')

    const tx = {
      to: proxy.address,
      value
    }
    await sender.sendTransaction(tx)
    const balanceAfter = await provider.getBalance(proxy.address)

    expect(balanceAfter).to.eq(balanceBefore.add(value))
  })

  it('should succesully claim ethers only', async () => {
    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 100,
      tokensAmount: 0,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
        gasLimit: 500000
      })
    ).to.emit(proxy, 'Claimed')
  })

  it('should be able to withdraw ethers from proxy to sender', async () => {
    const balanceBefore = await provider.getBalance(proxy.address)
    expect(balanceBefore).to.not.eq(0)
    await proxy.withdraw({ gasLimit: 200000 })
    const balanceAfter = await provider.getBalance(proxy.address)
    expect(balanceAfter).to.eq(0)
  })

  it('should succesfully claim both tokens and native tokens', async () => {
    await sender.sendTransaction({
      to: proxy.address,
      value: ethers.utils.parseEther('2')
    })

    await tokenInstance.approve(proxy.address, tokensAmount)

    link = await createLink({
      token: tokenInstance.address,
      feeToken,
      feeReceiver,
      nativeTokensAmount: 100,
      tokensAmount,
      feeAmount,
      expiration,
      version,
      chainId,
      linkdropContract: proxy.address,
      signingKeyOrWallet: signer
    })
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    const proxyEthBalanceBefore = await provider.getBalance(proxy.address)
    const senderTokenBalanceBefore = await tokenInstance.balanceOf(
      sender.address
    )

    await proxy.claim(link.linkParams, receiverAddress, receiverSignature, {
      gasLimit: 500000
    })

    const proxyEthBalanceAfter = await provider.getBalance(proxy.address)
    expect(proxyEthBalanceAfter).to.eq(
      proxyEthBalanceBefore.sub(100).sub(feeAmount)
    )

    const senderTokenBalanceAfter = await tokenInstance.balanceOf(
      sender.address
    )
    expect(senderTokenBalanceAfter).to.eq(
      senderTokenBalanceBefore.sub(tokensAmount)
    )

    const receiverEthBalance = await provider.getBalance(receiverAddress)
    expect(receiverEthBalance).to.eq(100)

    const receiverTokenBalance = await tokenInstance.balanceOf(receiverAddress)
    expect(receiverTokenBalance).to.eq(tokensAmount)
  })
})
