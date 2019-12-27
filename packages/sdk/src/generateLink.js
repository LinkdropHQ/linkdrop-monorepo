import { createLink, createLinkERC721, computeProxyAddress } from './utils'
const ethers = require('ethers')
// Turn off annoying warnings
ethers.errors.setLogLevel('error')

export const generateLink = async ({
  factoryAddress,
  chainId,
  claimHost,
  linkdropMasterAddress,
  signingKeyOrWallet,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  version,
  campaignId,
  wallet
}) => {
  if (factoryAddress === null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }

  if (chainId === null || chainId === '') {
    throw new Error('Please provide chainId')
  }

  if (claimHost === null || claimHost === '') {
    throw new Error('Please provide claim host')
  }

  if (linkdropMasterAddress === null || linkdropMasterAddress === '') {
    throw new Error("Please provide linkdrop master's address")
  }

  if (signingKeyOrWallet === null || signingKeyOrWallet === '') {
    throw new Error('Please provide signing key or wallet')
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
    throw new Error('Please provide contract version')
  }

  if (campaignId === null || campaignId === '') {
    throw new Error('Please provide campaign id')
  }

  let linkdropSigner
  if (typeof signingKeyOrWallet === 'string') {
    linkdropSigner = new ethers.Wallet(signingKeyOrWallet)
  } else if (typeof signingKeyOrWallet === 'object') {
    linkdropSigner = signingKeyOrWallet
  }

  const proxyAddress = computeProxyAddress(
    factoryAddress,
    linkdropMasterAddress,
    campaignId
  )

  const { linkKey, linkId, linkdropSignerSignature } = await createLink({
    linkdropSigner,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    proxyAddress
  })

  // Construct link
  let url = `${claimHost}/#/receive?weiAmount=${weiAmount}&tokenAddress=${tokenAddress}&tokenAmount=${tokenAmount}&expirationTime=${expirationTime}&version=${version}&chainId=${chainId}&linkKey=${linkKey}&linkdropMasterAddress=${linkdropMasterAddress}&linkdropSignerSignature=${linkdropSignerSignature}&campaignId=${campaignId}`

  if (wallet) {
    url = `${url}&w=${wallet}`
  }

  return { url, linkId, linkKey, linkdropSignerSignature }
}

export const generateLinkERC721 = async ({
  factoryAddress,
  chainId,
  claimHost,
  linkdropMasterAddress,
  signingKeyOrWallet,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  version,
  campaignId,
  wallet
}) => {
  if (factoryAddress === null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }

  if (chainId === null || chainId === '') {
    throw new Error('Please provide chain id')
  }

  if (claimHost === null || claimHost === '') {
    throw new Error('Please provide claim host')
  }

  if (linkdropMasterAddress === null || linkdropMasterAddress === '') {
    throw new Error(`Please provide linkdrop master's address`)
  }

  if (signingKeyOrWallet === null || signingKeyOrWallet === '') {
    throw new Error(`Please provide signing key or wallet`)
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
    throw new Error('Please provide contract version')
  }

  if (campaignId === null || campaignId === '') {
    throw new Error('Please provide campaign id')
  }

  let linkdropSigner
  if (typeof signingKeyOrWallet === 'string') {
    linkdropSigner = new ethers.Wallet(signingKeyOrWallet)
  } else if (typeof signingKeyOrWallet === 'object') {
    linkdropSigner = signingKeyOrWallet
  }

  const proxyAddress = computeProxyAddress(
    factoryAddress,
    linkdropMasterAddress,
    campaignId
  )

  const { linkKey, linkId, linkdropSignerSignature } = await createLinkERC721({
    linkdropSigner,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId,
    proxyAddress
  })

  // Construct link
  let url = `${claimHost}/#/receive?weiAmount=${weiAmount}&nftAddress=${nftAddress}&tokenId=${tokenId}&expirationTime=${expirationTime}&version=${version}&chainId=${chainId}&linkKey=${linkKey}&linkdropMasterAddress=${linkdropMasterAddress}&linkdropSignerSignature=${linkdropSignerSignature}&campaignId=${campaignId}`

  if (wallet) {
    url = `${url}&w=${wallet}`
  }

  return { url, linkId, linkKey, linkdropSignerSignature }
}
