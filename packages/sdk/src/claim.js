import { signReceiverAddress } from './utils'
const ethers = require('ethers')
const axios = require('axios')
// Turn off annoying warnings
ethers.errors.setLogLevel('error')

export const claim = async ({
  jsonRpcUrl,
  apiHost,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  version,
  chainId,
  linkKey,
  linkdropMasterAddress,
  linkdropSignerSignature,
  receiverAddress,
  factoryAddress,
  campaignId
}) => {
  if (jsonRpcUrl === null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (apiHost === null || apiHost === '') {
    throw new Error('Please provide api host')
  }

  if (weiAmount === null || weiAmount === '') {
    throw new Error('Please provide amount of eth to claim')
  }

  if (tokenAddress === null || tokenAddress === '') {
    throw new Error('Please provide ERC20 token address')
  }

  if (tokenAmount === null || tokenAmount === '') {
    throw new Error('Please provide amount of tokens to claim')
  }

  if (expirationTime === null || expirationTime === '') {
    throw new Error('Please provide expiration time')
  }

  if (version === null || version === '') {
    throw new Error('Please provide mastercopy version ')
  }

  if (chainId === null || chainId === '') {
    throw new Error('Please provide chain id')
  }

  if (linkKey === null || linkKey === '') {
    throw new Error('Please provide link key')
  }

  if (linkdropMasterAddress === null || linkdropMasterAddress === '') {
    throw new Error('Please provide linkdropMaster address')
  }

  if (linkdropSignerSignature === null || linkdropSignerSignature === '') {
    throw new Error('Please provide linkdropMaster signature')
  }

  if (receiverAddress === null || receiverAddress === '') {
    throw new Error('Please provide receiver address')
  }

  if (campaignId === null || campaignId === '') {
    throw new Error('Please provide campaign id')
  }

  if (factoryAddress === null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const claimParams = {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    factoryAddress,
    campaignId
  }

  const response = await axios.post(
    `${apiHost}/api/v1/linkdrops/claim`,
    claimParams
  )

  const { error, errors, success, txHash } = response.data
  return { error, errors, success, txHash }
}

export const claimERC721 = async ({
  jsonRpcUrl,
  apiHost,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  version,
  chainId,
  linkKey,
  linkdropMasterAddress,
  linkdropSignerSignature,
  receiverAddress,
  factoryAddress,
  campaignId
}) => {
  if (jsonRpcUrl === null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (apiHost === null || apiHost === '') {
    throw new Error('Please provide api host')
  }

  if (weiAmount === null || weiAmount === '') {
    throw new Error('Please provide amount of eth to claim')
  }

  if (
    nftAddress === null ||
    nftAddress === '' ||
    nftAddress === ethers.constants.AddressZero
  ) {
    throw new Error('Please provide ERC721 token address')
  }

  if (tokenId === null || tokenId === '') {
    throw new Error('Please provide token id to claim')
  }

  if (expirationTime === null || expirationTime === '') {
    throw new Error('Please provide expiration time')
  }

  if (version === null || version === '') {
    throw new Error('Please provide mastercopy version ')
  }

  if (chainId === null || chainId === '') {
    throw new Error('Please provide chain id')
  }

  if (linkKey === null || linkKey === '') {
    throw new Error('Please provide link key')
  }

  if (linkdropMasterAddress === null || linkdropMasterAddress === '') {
    throw new Error('Please provide linkdropMaster address')
  }

  if (linkdropSignerSignature === null || linkdropSignerSignature === '') {
    throw new Error('Please provide linkdropMaster signature')
  }

  if (receiverAddress === null || receiverAddress === '') {
    throw new Error('Please provide receiver address')
  }

  if (campaignId === null || campaignId === '') {
    throw new Error('Please provide campaign id')
  }

  if (factoryAddress === null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const claimParams = {
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId,
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    factoryAddress,
    campaignId
  }

  const response = await axios.post(
    `${apiHost}/api/v1/linkdrops/claim-erc721`,
    claimParams
  )

  const { error, errors, success, txHash } = response.data
  return { error, errors, success, txHash }
}
