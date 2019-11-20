import { computeProxyAddress } from './utils'
import * as generateLinkUtils from './generateLink'
import * as claimUtils from './claim'
import * as deployUtils from './deployProxy'
import * as topupAndApproveUtils from './topupAndApprove'
import { subscribeForClaimEvents } from './subscribeForEvents'
import LinkdropFactory from '@linkdrop/contracts/build/LinkdropFactory'
import { ethers } from 'ethers'
import { AddressZero } from 'ethers/constants'

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

class LinkdropSDK {
  constructor ({
    senderAddress,
    factoryAddress,
    chain = 'mainnet',
    jsonRpcUrl = getJsonRpcUrl(chain),
    apiHost = `https://${chain}.linkdrop.io`,
    claimHost = 'https://claim.linkdrop.io'
  }) {
    if (senderAddress == null || senderAddress === '') {
      throw new Error('Please provide sender address')
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

    this.senderAddress = senderAddress
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
        this.senderAddress,
        campaignId
      )
    }
    return this.version[campaignId]
  }

  async generateLink ({
    campaignId = 0,
    token = AddressZero,
    nft = AddressZero,
    feeToken = AddressZero,
    feeReceiver = AddressZero,
    nativeTokensAmount = 0,
    tokensAmount = 0,
    tokenId = 0,
    feeAmount = 0,
    expiration = 11111111111,
    signingKeyOrWallet
  }) {
    return generateLinkUtils.generateLink({
      claimHost: this.claimHost,
      factory: this.factoryAddress,
      sender: this.senderAddress,
      campaignId,
      token,
      nft,
      feeToken,
      feeReceiver,
      nativeTokensAmount,
      tokensAmount,
      tokenId,
      feeAmount,
      expiration,
      version: this.version[campaignId] || (await this.getVersion(campaignId)),
      chainId: this.chainId,
      signingKeyOrWallet
    })
  }

  getProxyAddress (campaignId = 0) {
    return computeProxyAddress(
      this.factoryAddress,
      this.senderAddress,
      campaignId
    )
  }

  async claim ({
    token,
    nft,
    feeToken,
    feeReceiver,
    linkKey,
    nativeTokensAmount,
    tokensAmount,
    tokenId,
    feeAmount,
    expiration,
    signerSignature,
    receiverAddress,
    linkdropContract,
    sender
  }) {
    const claimParams = {
      jsonRpcUrl: this.jsonRpcUrl,
      apiHost: this.apiHost,
      token,
      nft,
      feeToken,
      feeReceiver,
      linkKey,
      nativeTokensAmount,
      tokensAmount,
      tokenId,
      feeAmount,
      expiration,
      signerSignature,
      receiverAddress,
      linkdropContract,
      sender
    }
    if (linkdropContract === this.getProxyAddress()) {
      const { isDeployed } = await this.isDeployed()
      if (isDeployed === false) {
        return claimUtils.claimAndDeploy(claimParams)
      }
    }
    return claimUtils.claim(claimParams)
  }

  async topup ({ signingKeyOrWallet, proxyAddress, nativeTokensAmount }) {
    return topupAndApproveUtils.topup({
      jsonRpcUrl: this.jsonRpcUrl,
      signingKeyOrWallet,
      proxyAddress,
      nativeTokensAmount
    })
  }

  async approve ({
    signingKeyOrWallet,
    proxyAddress,
    tokenAddress,
    tokensAmount
  }) {
    return topupAndApproveUtils.approve({
      jsonRpcUrl: this.jsonRpcUrl,
      signingKeyOrWallet,
      proxyAddress,
      tokenAddress,
      tokensAmount
    })
  }

  async approveNFT ({ signingKeyOrWallet, proxyAddress, nftAddress }) {
    return topupAndApproveUtils.approveNFT({
      jsonRpcUrl: this.jsonRpcUrl,
      signingKeyOrWallet,
      proxyAddress,
      nftAddress
    })
  }

  async deployProxy ({
    signingKeyOrWallet,
    campaignId = 0,
    nativeTokensAmount = 0
  }) {
    return deployUtils.deployProxy({
      jsonRpcUrl: this.jsonRpcUrl,
      factoryAddress: this.factoryAddress,
      signingKeyOrWallet,
      campaignId,
      nativeTokensAmount
    })
  }

  async subscribeForClaimEvents (proxyAddress, callback) {
    return subscribeForClaimEvents(
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
      senderAddress: this.senderAddress,
      linkId
    })
  }

  async cancelLink (linkId) {
    return claimUtils.cancelLink({
      apiHost: this.apiHost,
      senderAddress: this.senderAddress,
      linkId
    })
  }

  async isDeployed (campaignId = 0) {
    return deployUtils.isDeployed({
      apiHost: this.apiHost,
      senderAddress: this.senderAddress,
      campaignId
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
