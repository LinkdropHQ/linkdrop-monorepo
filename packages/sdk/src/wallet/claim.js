import { signReceiverAddress } from './utils'
import axios from 'axios'
import { ethers } from 'ethers'

/**
 * @description Function to claim ETH and/or ERC20 tokens
 * @param {String} apiHost API host
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {Number} tokenAmount Amount of tokens
 * @param {Number} expirationTime Link expiration timestamp
 * @param {String} linkKey Ephemeral key attached to link
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} linkdropSignerSignature Linkdrop signer signature
 * @param {String} receiverAddress Receiver address
 */
export const claim = async ({
  apiHost,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  linkKey,
  linkdropModuleAddress,
  linkdropSignerSignature,
  receiverAddress
}) => {
  if (apiHost == null || apiHost === '') {
    throw new Error('apiHost param is required')
  }
  if (weiAmount == null || weiAmount === '') {
    throw new Error('weiAmount param is required')
  }
  if (tokenAddress == null || tokenAddress === '') {
    throw new Error('tokenAddress param is required')
  }
  if (tokenAmount == null || tokenAmount === '') {
    throw new Error('tokenAmount param is required')
  }
  if (expirationTime == null || expirationTime === '') {
    throw new Error('expirationTime param is required')
  }
  if (linkKey == null || linkKey === '') {
    throw new Error('linkKey param is required')
  }
  if (linkdropModuleAddress == null || linkdropModuleAddress === '') {
    throw new Error('linkdropModuleAddress param is required')
  }
  if (linkdropSignerSignature == null || linkdropSignerSignature === '') {
    throw new Error('linkdropSignerSignature param is required')
  }
  if (receiverAddress == null || receiverAddress === '') {
    throw new Error('receiverAddress param is required')
  }

  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)
  const linkId = new ethers.Wallet(linkKey).address

  const claimParams = {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }

  const response = await axios.post(
    `${apiHost}/api/v1/linkdrops/claim`,
    claimParams
  )

  const { error, success, txHash } = response.data
  return { error, success, txHash }
}

/**
 * @description Function to claim ETH and/or ERC721 tokens
 * @param {String} apiHost API host
 * @param {String} weiAmount Wei amount
 * @param {String} nftAddress NFT address
 * @param {Number} tokenId Token id
 * @param {Number} expirationTime Link expiration timestamp
 * @param {String} linkKey Ephemeral key attached to link
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} linkdropSignerSignature Linkdrop signer signature
 * @param {String} receiverAddress Receiver address
 */
export const claimERC721 = async ({
  apiHost,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  linkKey,
  linkdropModuleAddress,
  linkdropSignerSignature,
  receiverAddress
}) => {
  if (apiHost == null || apiHost === '') {
    throw new Error('apiHost param is required')
  }
  if (weiAmount == null || weiAmount === '') {
    throw new Error('weiAmount param is required')
  }
  if (nftAddress == null || nftAddress === '') {
    throw new Error('nftAddress param is required')
  }
  if (tokenId == null || tokenId === '') {
    throw new Error('tokenId param is required')
  }
  if (expirationTime == null || expirationTime === '') {
    throw new Error('expirationTime param is required')
  }
  if (linkKey == null || linkKey === '') {
    throw new Error('linkKey param is required')
  }
  if (linkdropModuleAddress == null || linkdropModuleAddress === '') {
    throw new Error('linkdropModuleAddress param is required')
  }
  if (linkdropSignerSignature == null || linkdropSignerSignature === '') {
    throw new Error('linkdropSignerSignature param is required')
  }
  if (receiverAddress == null || receiverAddress === '') {
    throw new Error('receiverAddress param is required')
  }

  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)
  const linkId = new ethers.Wallet(linkKey).address

  const claimParams = {
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }

  const response = await axios.post(
    `${apiHost}/api/v1/linkdrops/claim-erc721`,
    claimParams
  )

  const { error, success, txHash } = response.data
  return { error, success, txHash }
}
