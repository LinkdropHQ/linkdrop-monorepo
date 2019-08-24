/* global describe, it */
import { expect } from 'chai'
import generateLinkERC20Generator from 'data/store/saga/tokens/every/claim-tokens-erc20.js'
import { put } from 'redux-saga/effects'
import { LinkdropSDK } from '@linkdrop/sdk/src/index'
import { jsonRpcUrl, apiHost, factory } from 'config'
import { ethers } from 'ethers'
import { defineNetworkName, mocks } from '@linkdrop/commons'
import { createMockProvider } from 'ethereum-waffle'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
const provider = createMockProvider()

describe('data/store/saga/tokens/every/claim-tokens-erc20.js ERC-20', () => {
  const wallet = '0x0fc0c96d5aba156b1263311812a7b3d0812f4120b8f3f4288c0b7806fc2aaa2a'
  const tokenAddress = '0x1a031d35e1c90cd6e4228f03c2b31cea5a0956c89be0c1c576fa52b76e2f50e2'
  const linkKey = '0x3e42a6647091a256103b6ad3d310b3887b3fe5d7f5e3d71df2f03985ca5ea071'
  const linkdropMasterAddress = '0xbF0e4036BF968dD007F9B4A1BFdA4e54C042F612'
  const linkdropSignerSignature = '0xd49fe15958f67d0349b4ff98d1367c9a9a709f3c0e571c2dc41741bef883cb5606f05cbd6e292ae22644a69a68fd3df69a03d0a'
  const ethAmount = '0'
  const tokenAmount = '100'
  const chainId = '1'
  const expirationTime = '1900000000000000'
  const payload = {
    wallet,
    tokenAddress,
    tokenAmount,
    ethAmount,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature
  }
  const networkName = defineNetworkName({ chainId })
  const ethersContractZeroAddress = ethers.constants.AddressZero
  const gen = generateLinkERC20Generator({ payload })
  const factoryContract = new ethers.Contract(factory, LinkdropFactory.abi, provider)
  const version = mocks.version
  const result = {
    success: true,
    txHash: '0xbF0e4036BF968dD007F9B4A1BFdA4e54C042F612'
  }

  it('enable loading', () => {
    expect(
      gen.next(ethersContractZeroAddress).value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('get provider', () => {
    expect(
      gen.next(networkName).value
    ).to.deep.equal(
      ethers.getDefaultProvider(networkName)
    )
  })

  it('get contract obj', () => {
    const currentProvider = gen.next(provider).value
    const actualProvider = new ethers.Contract(factory, LinkdropFactory.abi, provider)
    expect(
      typeof currentProvider
    ).to.deep.equal(
      typeof actualProvider
    )
  })

  it('get version', () => {
    expect(
      gen.next(factoryContract).value
    ).to.deep.equal(
      factoryContract.getProxyMasterCopyVersion(linkdropMasterAddress)
    )
  })

  it('claim tokens with link', () => {
    expect(
      gen.next(version).value
    ).to.deep.equal(
      LinkdropSDK.claim({
        jsonRpcUrl,
        host: apiHost,
        weiAmount: '0',
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkKey,
        linkdropMasterAddress,
        linkdropSignerSignature,
        receiverAddress: wallet,
        isApprove: false,
        version
      })
    )
  })

  it('set txHash', () => {
    expect(
      gen.next(result).value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: '0xbF0e4036BF968dD007F9B4A1BFdA4e54C042F612' } })
    )
  })

  it('disable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    )
  })
})
