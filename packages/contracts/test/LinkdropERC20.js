/* global describe, before, it */

import chai from 'chai'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import { getDeployData } from '@universal-login/contracts'
import ProxyContract from '@universal-login/contracts/build/Proxy.json'

import LinkdropFactory from '../build/LinkdropFactory'
import LinkdropMastercopy from '../build/LinkdropMastercopy'
import TokenMock from '../build/TokenMock'
import ProxyCounterfactualFactory from '../metadata/ProxyCounterfactualFactory'
import WalletMasterWithRefund from '../metadata/WalletMasterWithRefund'

import {
  computeProxyAddress,
  createLink,
  signReceiverAddress,
  computeBytecode
} from '../scripts/utils'

import { WalletSDK } from '@linkdrop/sdk'
import { AddressZero } from 'ethers/constants'

const ethers = require('ethers')

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

chai.use(solidity)
const { expect } = chai

let provider = createMockProvider()

let [linkdropMaster, receiver, nonsender, linkdropSigner, relayer] = getWallets(
  provider
)

let masterCopy
let factory
let proxy
let proxyAddress
let tokenInstance

let link
let receiverAddress
let receiverSignature
let weiAmount
let tokenAddress
let tokenAmount
let expirationTime
let version
let bytecode

const campaignId = 0
let standardFee

const initcode = '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
const chainId = 4 // Rinkeby

let walletMasterCopy, walletFactory

describe('ETH/ERC20 linkdrop tests', () => {
  before(async () => {
    tokenInstance = await deployContract(linkdropMaster, TokenMock)
  })

  it('should deploy master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(linkdropMaster, LinkdropMastercopy, [], {
      gasLimit: 6000000
    })
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
  })

  it('should deploy factory', async () => {
    bytecode = computeBytecode(masterCopy.address)
    factory = await deployContract(
      linkdropMaster,
      LinkdropFactory,
      [masterCopy.address, chainId],
      {
        gasLimit: 6000000
      }
    )

    expect(factory.address).to.not.eq(ethers.constants.AddressZero)
    let version = await factory.masterCopyVersion()
    expect(version).to.eq(1)

    await factory.addRelayer(relayer.address)
    const isWhitelisted = await factory.isRelayer(relayer.address)
    expect(isWhitelisted).to.be.true
    standardFee = await factory.standardFee()
  })

  it('should deploy proxy and delegate to implementation', async () => {
    // Compute next address with js function
    proxyAddress = computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      campaignId,
      initcode
    )

    await expect(
      factory.deployProxy(campaignId, {
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    let linkdropMasterAddress = await proxy.linkdropMaster()
    expect(linkdropMasterAddress).to.eq(linkdropMaster.address)

    let version = await proxy.version()
    expect(version).to.eq(1)

    let owner = await proxy.owner()
    expect(owner).to.eq(factory.address)

    await linkdropMaster.sendTransaction({
      to: proxy.address,
      value: ethers.utils.parseEther('2')
    })
  })

  it('linkdropMaster should be able to add new signing keys', async () => {
    let isSigner = await proxy.isLinkdropSigner(linkdropSigner.address)
    expect(isSigner).to.eq(false)
    await proxy.addSigner(linkdropSigner.address, { gasLimit: 500000 })
    isSigner = await proxy.isLinkdropSigner(linkdropSigner.address)
    expect(isSigner).to.eq(true)

    await proxy.addSigner(receiver.address, { gasLimit: 500000 })
  })

  it('non linkdropMaster should not be able to remove signing key', async () => {
    let proxyInstance = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      nonsender
    )

    let isSigner = await proxyInstance.isLinkdropSigner(receiver.address)
    expect(isSigner).to.eq(true)

    await expect(
      proxyInstance.removeSigner(receiver.address, { gasLimit: 500000 })
    ).to.be.revertedWith('ONLY_LINKDROP_MASTER')
    isSigner = await proxyInstance.isLinkdropSigner(receiver.address)
    expect(isSigner).to.eq(true)
  })

  it('linkdropMaster should be able to remove signing key', async () => {
    let isSigner = await proxy.isLinkdropSigner(receiver.address)
    expect(isSigner).to.eq(true)

    await proxy.removeSigner(receiver.address, { gasLimit: 500000 })

    isSigner = await proxy.isLinkdropSigner(receiver.address)
    expect(isSigner).to.eq(false)
  })

  it('should revert while checking claim params with insufficient allowance', async () => {
    weiAmount = 0
    tokenAddress = tokenInstance.address
    tokenAmount = 100
    expirationTime = 11234234223
    version = 1
    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.checkClaimParams(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature
      )
    ).to.be.revertedWith('INSUFFICIENT_ALLOWANCE')
  })

  it('creates new link key and verifies its signature', async () => {
    let senderAddr = await proxy.linkdropMaster()
    expect(linkdropMaster.address).to.eq(senderAddr)

    expect(
      await proxy.verifyLinkdropSignerSignature(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        link.linkdropSignerSignature
      )
    ).to.be.true
  })

  it('signs receiver address with link key and verifies this signature onchain', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    expect(
      await proxy.verifyReceiverSignature(
        link.linkId,
        receiverAddress,
        receiverSignature
      )
    ).to.be.true
  })

  it('non-linkdropMaster should not be able to pause contract', async () => {
    let proxyInstance = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      nonsender
    )
    // Pausing
    await expect(proxyInstance.pause({ gasLimit: 500000 })).to.be.revertedWith(
      'ONLY_LINKDROP_MASTER'
    )
  })

  it('linkdropMaster should be able to pause contract', async () => {
    // Pausing
    await proxy.pause({ gasLimit: 500000 })
    let paused = await proxy.paused()
    expect(paused).to.eq(true)
  })

  it('linkdropMaster should be able to unpause contract', async () => {
    // Unpausing
    await proxy.unpause({ gasLimit: 500000 })
    let paused = await proxy.paused()
    expect(paused).to.eq(false)
  })

  it('linkdropMaster should be able to cancel link', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )
    await expect(proxy.cancel(link.linkId, { gasLimit: 200000 })).to.emit(
      proxy,
      'Canceled'
    )
    let canceled = await proxy.isCanceledLink(link.linkId)
    expect(canceled).to.eq(true)
  })

  it('should fail to claim tokens when paused', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    // Pausing
    await proxy.pause({ gasLimit: 500000 })

    await expect(
      factory.checkClaimParams(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature
      )
    ).to.be.revertedWith('LINKDROP_PROXY_CONTRACT_PAUSED')
  })

  it('should fail to claim with insufficient allowance', async () => {
    factory = factory.connect(relayer)

    // Unpause
    await proxy.unpause({ gasLimit: 500000 })

    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('INSUFFICIENT_ALLOWANCE')
  })

  it('should fail to claim tokens by expired link', async () => {
    // Approving tokens from linkdropMaster to Linkdrop Contract
    await tokenInstance.approve(proxy.address, tokenAmount)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      0,
      version,
      chainId,
      proxyAddress
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        0,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('LINK_EXPIRED')
  })

  it('should fail to claim with invalid contract version', async () => {
    const invalidVersion = 0

    // Approving tokens from linkdropMaster to Linkdrop Contract
    await tokenInstance.approve(proxy.address, tokenAmount)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      invalidVersion,
      chainId,
      proxyAddress
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('INVALID_LINKDROP_SIGNER_SIGNATURE')
  })

  it('should fail to claim with invalid chain id', async () => {
    const invalidChainId = 0
    // Approving tokens from linkdropMaster to Linkdrop Contract
    await tokenInstance.approve(proxy.address, tokenAmount)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      invalidChainId,
      proxyAddress
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('INVALID_LINKDROP_SIGNER_SIGNATURE')
  })

  it('should succesfully claim tokens with valid claim params and send fee to relayer', async () => {
    // Approving tokens from linkdropMaster to Linkdrop Contract
    await tokenInstance.approve(proxy.address, tokenAmount)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    let approverBalanceBefore = await tokenInstance.balanceOf(
      linkdropMaster.address
    )

    await factory.claim(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      link.linkId,
      linkdropMaster.address,
      campaignId,
      link.linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 800000 }
    )

    let approverBalanceAfter = await tokenInstance.balanceOf(
      linkdropMaster.address
    )
    expect(approverBalanceAfter).to.eq(approverBalanceBefore.sub(tokenAmount))

    let receiverTokenBalance = await tokenInstance.balanceOf(receiverAddress)
    expect(receiverTokenBalance).to.eq(tokenAmount)
  })

  it('should be able to check link claimed from factory instance', async () => {
    let claimed = await factory.isClaimedLink(
      linkdropMaster.address,
      campaignId,
      link.linkId
    )
    expect(claimed).to.eq(true)
  })

  it('should fail to claim link twice', async () => {
    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('LINK_CLAIMED')
  })

  it('should fail to claim unavailable amount of tokens', async () => {
    const unavailableAmountOfTokens = 1000000000000

    // Approving tokens from linkdropMaster to Linkdrop Contract
    await tokenInstance.approve(proxy.address, tokenAmount)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      unavailableAmountOfTokens,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        unavailableAmountOfTokens,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 800000 }
      )
    ).to.be.revertedWith('INSUFFICIENT_TOKENS')
  })

  it('should fail to claim tokens with fake linkdropMaster signature', async () => {
    // Approving tokens from linkdropMaster to Linkdrop Contract
    await tokenInstance.approve(proxy.address, tokenAmount)

    let wallet = ethers.Wallet.createRandom()
    let linkId = wallet.address

    let message = ethers.utils.solidityKeccak256(['address'], [linkId])
    let messageToSign = ethers.utils.arrayify(message)
    let fakeSignature = await receiver.signMessage(messageToSign)

    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkId,
        linkdropMaster.address,
        campaignId,
        fakeSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('INVALID_LINKDROP_SIGNER_SIGNATURE')
  })

  it('should fail to claim tokens with fake receiver signature', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )

    let fakeLink = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(
      fakeLink.linkKey, // signing receiver address with fake link key
      receiverAddress
    )
    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('INVALID_RECEIVER_SIGNATURE')
  })

  it('should fail to claim tokens by canceled link', async () => {
    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await proxy.cancel(link.linkId, { gasLimit: 100000 })

    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.be.revertedWith('LINK_CANCELED')
  })

  it('should be able to get balance and send ethers to proxy', async () => {
    let balanceBefore = await provider.getBalance(proxy.address)

    let wei = ethers.utils.parseEther('2')
    // send some eth
    let tx = {
      to: proxy.address,
      value: wei
    }
    await linkdropMaster.sendTransaction(tx)
    let balanceAfter = await provider.getBalance(proxy.address)

    expect(balanceAfter).to.eq(balanceBefore.add(wei))
  })

  it('should succesully claim ethers only', async () => {
    weiAmount = 100 // wei
    tokenAmount = 0
    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )
    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    await expect(
      factory.claim(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address,
        campaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )
    ).to.emit(proxy, 'Claimed')
  })

  it('should be able to withdraw ethers from proxy to linkdropMaster', async () => {
    let balanceBefore = await provider.getBalance(proxy.address)
    expect(balanceBefore).to.not.eq(0)
    await proxy.withdraw({ gasLimit: 200000 })
    let balanceAfter = await provider.getBalance(proxy.address)
    expect(balanceAfter).to.eq(0)
  })

  it('should succesfully claim tokens and ethers simultaneously', async () => {
    weiAmount = 15 // wei
    tokenAmount = 20

    // Approving tokens from linkdropMaster to Linkdrop Contract
    await tokenInstance.approve(proxy.address, 20)

    // Send ethers to Linkdrop contract
    let tx = {
      to: proxy.address,
      value: ethers.utils.parseEther('2')
    }
    await linkdropMaster.sendTransaction(tx)

    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    let proxyEthBalanceBefore = await provider.getBalance(proxy.address)
    let approverTokenBalanceBefore = await tokenInstance.balanceOf(
      linkdropMaster.address
    )

    await factory.claim(
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      link.linkId,
      linkdropMaster.address,
      campaignId,
      link.linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      { gasLimit: 500000 }
    )

    let proxyEthBalanceAfter = await provider.getBalance(proxy.address)
    expect(proxyEthBalanceAfter).to.eq(
      proxyEthBalanceBefore.sub(weiAmount).sub(standardFee)
    )

    let approverTokenBalanceAfter = await tokenInstance.balanceOf(
      linkdropMaster.address
    )
    expect(approverTokenBalanceAfter).to.eq(
      approverTokenBalanceBefore.sub(tokenAmount)
    )

    let receiverEthBalance = await provider.getBalance(receiverAddress)
    expect(receiverEthBalance).to.eq(weiAmount)

    let receiverTokenBalance = await tokenInstance.balanceOf(receiverAddress)
    expect(receiverTokenBalance).to.eq(tokenAmount)
  })

  it('should fail to claim tokens from not deployed proxy', async () => {
    const newCampaignId = 2
    weiAmount = 0 // wei
    tokenAddress = tokenInstance.address
    tokenAmount = 123
    expirationTime = 11234234223
    version = 1

    let proxyAddress = await computeProxyAddress(
      factory.address,
      linkdropMaster.address,
      newCampaignId,
      initcode
    )

    // Contract not deployed yet
    proxy = new ethers.Contract(
      proxyAddress,
      LinkdropMastercopy.abi,
      linkdropMaster
    )

    await linkdropMaster.sendTransaction({
      to: proxyAddress,
      value: ethers.utils.parseEther('2')
    })

    link = await createLink(
      linkdropSigner,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      proxyAddress
    )

    receiverAddress = ethers.Wallet.createRandom().address
    receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

    // Approving tokens from linkdropMaster to Linkdrop Contract
    await tokenInstance.approve(proxyAddress, tokenAmount)
    await expect(
      factory.checkClaimParams(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        link.linkId,
        linkdropMaster.address, // New
        newCampaignId,
        link.linkdropSignerSignature,
        receiverAddress,
        receiverSignature
      )
    ).to.be.revertedWith('LINKDROP_PROXY_CONTRACT_NOT_DEPLOYED')
  })

  it('should deploy wallet master', async () => {
    walletMasterCopy = await deployContract(
      linkdropMaster,
      WalletMasterWithRefund,
      [],
      {
        gasLimit: 6000000
      }
    )
    expect(walletMasterCopy.address).to.not.eq(ethers.constants.AddressZero)
  })

  it('should deploy wallet factory', async () => {
    const initData = getDeployData(ProxyContract, [
      walletMasterCopy.address,
      '0x0'
    ])

    walletFactory = await deployContract(
      linkdropMaster,
      ProxyCounterfactualFactory,
      [initData, factory.address],
      {
        gasLimit: 6000000
      }
    )
    expect(walletFactory.address).to.not.eq(ethers.constants.AddressZero)
  })

  // it('Should claim and deploy', async () => {
  //   // Approving tokens from linkdropMaster to Linkdrop Contract
  //   await tokenInstance.approve(proxyAddress, tokenAmount)
  //   link = await createLink(
  //     linkdropSigner,
  //     weiAmount,
  //     tokenAddress,
  //     tokenAmount,
  //     expirationTime,
  //     version,
  //     chainId,
  //     proxyAddress
  //   )

  //   receiverAddress = ethers.Wallet.createRandom().address

  //   let balance = await provider.getBalance(receiverAddress)
  //   console.log('balance: ', +balance)
  //   receiverSignature = await signReceiverAddress(link.linkKey, receiverAddress)

  //   const tx = await factory.claimAndDeploy(
  //     weiAmount,
  //     tokenAddress,
  //     tokenAmount,
  //     expirationTime,
  //     link.linkId,
  //     linkdropMaster.address, // New
  //     campaignId,
  //     link.linkdropSignerSignature,
  //     receiverAddress,
  //     receiverSignature,
  //     AddressZero,
  //     setStrData
  //   )

  //   balance = await provider.getBalance(receiverAddress)
  //   console.log('balance: ', +balance)
  // })
})
