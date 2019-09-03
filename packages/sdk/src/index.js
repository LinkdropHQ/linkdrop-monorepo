import { computeProxyAddress } from './utils'
import * as generateLinkUtils from './generateLink'
import * as claimUtils from './claim'

import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { ethers } from 'ethers'
// Turn off annoying warnings
ethers.errors.setLogLevel('error')

const LinkdropSDK = ({
  linkdropMasterAddress,
  factoryAddress,
  chain = 'rinkeby',
  chainId = getChainId(chain),
  jsonRpcUrl = `https://${chain}.infura.io`,
  apiHost = `https://${chain}.linkdrop.io`,
  claimHost = 'https://claim.linkdrop.io'
}) => {
  if (linkdropMasterAddress == null || linkdropMasterAddress === '') {
    throw new Error('Please provide linkdrop master address')
  }

  if (factoryAddress == null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }

  if (chainId == null) {
    throw new Error('Please provide valid chain and/or chain id')
  }

  let version = {}

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  const factoryContract = new ethers.Contract(
    factoryAddress,
    LinkdropFactory.abi,
    provider
  )

  const getVersion = async campaignId => {
    if (!version[campaignId]) {
      version[campaignId] = await factoryContract.getProxyMasterCopyVersion(
        linkdropMasterAddress,
        campaignId
      )
    }
    return version[campaignId]
  }

  const generateLink = async ({
    signingKeyOrWallet,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime = 12345678910,
    campaignId
  }) => {
    return generateLinkUtils.generateLink({
      factoryAddress,
      chainId,
      claimHost,
      linkdropMasterAddress,
      signingKeyOrWallet,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version: version[campaignId] || (await getVersion(campaignId)),
      campaignId
    })
  }

  const generateLinkERC721 = async ({
    signingKeyOrWallet,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910,
    campaignId
  }) => {
    return generateLinkUtils.generateLinkERC721({
      factoryAddress,
      chainId,
      claimHost,
      linkdropMasterAddress,
      signingKeyOrWallet,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version: version[campaignId] || (await getVersion(campaignId)),
      campaignId
    })
  }

  const getProxyAddress = campaingId => {
    return computeProxyAddress(
      factoryAddress,
      linkdropMasterAddress,
      campaingId
    )
  }

  const claim = async ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime = 12345678910,
    linkKey,
    linkdropSignerSignature,
    receiverAddress,
    campaignId
  }) => {
    return claimUtils.claim({
      jsonRpcUrl,
      apiHost,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version: version[campaignId] || (await getVersion(campaignId)),
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      factoryAddress,
      campaignId
    })
  }

  const claimERC721 = async ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime = 12345678910,
    linkKey,
    linkdropSignerSignature,
    receiverAddress,
    campaignId
  }) => {
    return claimUtils.claimERC721({
      jsonRpcUrl,
      apiHost,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version: version[campaignId] || (await getVersion(campaignId)),
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      factoryAddress,      
      campaignId
    })
  }

  return {
    getProxyAddress,
    computeProxyAddress,
    generateLink,
    generateLinkERC721,
    claim,
    claimERC721
  }
}

const getChainId = chain => {
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
    default:
      chainId = null
  }
  return chainId
}

export default LinkdropSDK
