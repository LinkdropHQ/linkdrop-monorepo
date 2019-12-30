import { computeProxyAddress } from './utils'
import * as generateLinkUtils from './generateLink'
import * as claimUtils from './claim'
import * as deployUtils from './deployProxy'
import * as topupAndApproveUtils from './topupAndApprove'
import {
  subscribeForClaimedEvents,
  subscribeForClaimedERC721Events
} from './subscribeForEvents'

import LinkdropFactory from '@linkdrop/contracts/build/LinkdropFactory'
import { ethers } from 'ethers'

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

class LinkdropSDK {
  constructor ({
    linkdropMasterAddress,
    factoryAddress,
    chain = 'mainnet',
    jsonRpcUrl = getJsonRpcUrl(chain),
    apiHost = `https://${chain}.linkdrop.io`,
    claimHost = 'https://claim.linkdrop.io'
  }) {
    if (linkdropMasterAddress == null || linkdropMasterAddress === '') {
      throw new Error('Please provide linkdrop master address')
    }

    if (factoryAddress == null || factoryAddress === '') {
      throw new Error('Please provide factory address')
    }

    if (
      chain !== 'mainnet' &&
      chain !== 'ropsten' &&
      chain !== 'rinkeby' &&
      chain !== 'goerli' &&
      chain !== 'kovan' &&
      chain !== 'xdai'
    ) {
      throw new Error('Unsupported chain')
    }

    this.linkdropMasterAddress = linkdropMasterAddress
    this.factoryAddress = factoryAddress
    this.chain = chain
    this.chainId = getChainId(chain)
    this.jsonRpcUrl = jsonRpcUrl
    this.apiHost = apiHost
    this.claimHost = claimHost
    this.version = {}
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    this.factoryContract = new ethers.Contract(
      factoryAddress,
      LinkdropFactory.abi,
      this.provider
    )
  }

  async getVersion (campaignId) {
    if (!this.version[campaignId]) {
      this.version[
        campaignId
      ] = await this.factoryContract.getProxyMasterCopyVersion(
        this.linkdropMasterAddress,
        campaignId
      )
    }
    return this.version[campaignId]
  }

  async generateLink ({
    signingKeyOrWallet,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime = 12345678910,
    campaignId,
    wallet
  }) {
    return generateLinkUtils.generateLink({
      factoryAddress: this.factoryAddress,
      chainId: this.chainId,
      claimHost: this.claimHost,
      linkdropMasterAddress: this.linkdropMasterAddress,
      signingKeyOrWallet,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version: this.version[campaignId] || (await this.getVersion(campaignId)),
      campaignId,
      wallet
    })
  }

  async generateLinkERC721 ({
    signingKeyOrWallet,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910,
    campaignId,
    wallet
  }) {
    return generateLinkUtils.generateLinkERC721({
      factoryAddress: this.factoryAddress,
      chainId: this.chainId,
      claimHost: this.claimHost,
      linkdropMasterAddress: this.linkdropMasterAddress,
      signingKeyOrWallet,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version: this.version[campaignId] || (await this.getVersion(campaignId)),
      campaignId,
      wallet
    })
  }

  getProxyAddress (campaingId) {
    return computeProxyAddress(
      this.factoryAddress,
      this.linkdropMasterAddress,
      campaingId
    )
  }

  async claim ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime = 12345678910,
    linkKey,
    linkdropSignerSignature,
    receiverAddress,
    campaignId
  }) {
    return claimUtils.claim({
      jsonRpcUrl: this.json,
      apiHost: this.apiHost,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version: this.version[campaignId] || (await this.getVersion(campaignId)),
      chainId: this.chainId,
      linkKey,
      linkdropMasterAddress: this.linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      factoryAddress: this.factoryAddress,
      campaignId
    })
  }

  async claimERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910,
    linkKey,
    linkdropSignerSignature,
    receiverAddress,
    campaignId
  }) {
    return claimUtils.claimERC721({
      jsonRpcUrl: this.jsonRpcUrl,
      apiHost: this.apiHost,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version: this.version[campaignId] || (await this.getVersion(campaignId)),
      chainId: this.chainId,
      linkKey,
      linkdropMasterAddress: this.linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      factoryAddress: this.factoryAddress,
      campaignId
    })
  }

  async topup ({ signingKeyOrWallet, proxyAddress, weiAmount }) {
    return topupAndApproveUtils.topup({
      jsonRpcUrl: this.jsonRpcUrl,
      signingKeyOrWallet,
      proxyAddress,
      weiAmount
    })
  }

  async approve ({
    signingKeyOrWallet,
    proxyAddress,
    tokenAddress,
    tokenAmount
  }) {
    return topupAndApproveUtils.approve({
      jsonRpcUrl: this.jsonRpcUrl,
      signingKeyOrWallet,
      proxyAddress,
      tokenAddress,
      tokenAmount
    })
  }

  async approveERC721 ({ signingKeyOrWallet, proxyAddress, nftAddress }) {
    return topupAndApproveUtils.approveERC721({
      jsonRpcUrl: this.jsonRpcUrl,
      signingKeyOrWallet,
      proxyAddress,
      nftAddress
    })
  }

  async deployProxy ({ signingKeyOrWallet, campaignId = 0, weiAmount }) {
    return deployUtils.deployProxy({
      jsonRpcUrl: this.jsonRpcUrl,
      factoryAddress: this.factoryAddress,
      signingKeyOrWallet,
      campaignId,
      weiAmount
    })
  }

  async subscribeForClaimedEvents (proxyAddress, callback) {
    return subscribeForClaimedEvents(
      {
        jsonRpcUrl: this.jsonRpcUrl,
        proxyAddress
      },
      callback
    )
  }

  async subscribeForClaimedERC721Events (proxyAddress, callback) {
    return subscribeForClaimedERC721Events(
      {
        jsonRpcUrl: this.jsonRpcUrl,
        proxyAddress
      },
      callback
    )
  }

  async getLinkStatus (linkId) {
    return claimUtils.getLinkStatus({
      apiHost: this.apiHost,
      linkdropMasterAddress: this.linkdropMasterAddress,
      linkId
    })
  }

  async cancelLink (linkId) {
    return claimUtils.cancelLink({
      apiHost: this.apiHost,
      linkdropMasterAddress: this.linkdropMasterAddress,
      linkId
    })
  }
}

function getJsonRpcUrl (chain) {
  switch (chain) {
    case 'xdai':
      return 'https://dai.poa.network'
    default:
      return `https://${chain}.infura.io`
  }
}

function getChainId (chain) {
  switch (chain) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'goerli':
      return 5
    case 'kovan':
      return 42
    case 'xdai':
      return 100
    default:
      return null
  }
}

export default LinkdropSDK
