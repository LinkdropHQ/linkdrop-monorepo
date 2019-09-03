import { computeProxyAddress } from './utils'
import * as generateLinkUtils from './generateLink'
import * as claimUtils from './claim'
import * as deployUtils from './deployProxy'
import * as topupAndApproveUtils from './topupAndApprove'

import LinkdropFactory from '@linkdrop/contracts/build/LinkdropFactory'
import { ethers } from 'ethers'

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

class LinkdropSDK {
  constructor ({
    linkdropMasterAddress,
    factoryAddress,
    chain = 'mainnet',
    jsonRpcUrl = `https://${chain}.infura.io`,
    apiHost = `https://${chain}.linkdrop.io`,
    claimHost = 'https://claim.linkdrop.io'
  }) {
    if (linkdropMasterAddress == null || linkdropMasterAddress === '') {
      throw new Error('Please provide linkdrop master address')
    }

    if (factoryAddress == null || factoryAddress === '') {
      throw new Error('Please provide factory address')
    }

    if (chain !== 'rinkeby' && chain !== 'mainnet' && chain !== 'goerli') {
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
    campaignId
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
      campaignId
    })
  }

  async generateLinkERC721 ({
    signingKeyOrWallet,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910,
    campaignId
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
      campaignId
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
    return topupAndApproveUtils.topupAndApproveERC721({
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
}

function getChainId (chain) {
  let chainId
  switch (chain) {
    case 'mainnet':
      chainId = 1
      break
    case 'ropsten':
      chainId = 3
      break
    case 'rinkeby':
      chainId = 4
      break
    case 'goerli':
      chainId = 5
      break
    default:
      chainId = null
  }
  return chainId
}

export default LinkdropSDK
