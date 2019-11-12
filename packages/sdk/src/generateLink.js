import { createLink, computeProxyAddress } from './utils'
import { ethers } from 'ethers'
// Turn off annoying warnings
ethers.errors.setLogLevel('error')

export const generateLink = async ({
  claimHost,
  factory,
  sender,
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
  version,
  chainId,
  signingKeyOrWallet
}) => {
  if (claimHost == null || claimHost === '') {
    throw new Error('Please provide claim host')
  }
  if (factory == null || factory === '') {
    throw new Error('Please provide factory address')
  }
  if (sender == null || sender === '') {
    throw new Error('Please provide sender address')
  }
  if (campaignId == null || campaignId === '') {
    throw new Error('Please provide campaign id')
  }

  const linkdropContract = computeProxyAddress(factory, sender, campaignId)

  const { linkKey, linkId, linkParams, signerSignature } = await createLink({
    token,
    nft,
    feeToken,
    feeReceiver,
    nativeTokensAmount,
    tokensAmount,
    tokenId,
    feeAmount,
    expiration,
    version,
    chainId,
    linkdropContract,
    signingKeyOrWallet
  })

  // Construct url
  const url = `${claimHost}/#/receive?token=${token}&nft=${nft}&feeToken=${feeToken}&feeReceiver=${feeReceiver}&linkKey=${linkKey}&nativeTokensAmount=${nativeTokensAmount}&tokensAmount=${tokensAmount}&tokenId=${tokenId}&feeAmount=${feeAmount}&expiration=${expiration}&signerSignature=${signerSignature}&linkdropContract=${linkdropContract}`

  return { url, linkId, linkKey, linkParams, signerSignature }
}
