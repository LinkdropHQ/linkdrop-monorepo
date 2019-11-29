import { signReceiverAddress, LinkParams } from './utils'
import axios from 'axios'
import { ethers } from 'ethers'
// Turn off annoying warnings
ethers.errors.setLogLevel('error')

export const claim = async ({
  jsonRpcUrl,
  apiHost,
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
  linkdropContract
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (apiHost == null || apiHost === '') {
    throw new Error('Please provide api host')
  }

  if (nativeTokensAmount == null || nativeTokensAmount === '') {
    throw new Error('Please provide native tokens amount to claim')
  }

  if (token == null || token === '') {
    throw new Error('Please provide token address')
  }

  if (nft == null || nft === '') {
    throw new Error('Please provide NFT address')
  }

  if (feeToken == null || feeToken === '') {
    throw new Error('Please provide fee token address')
  }

  if (feeReceiver == null || feeReceiver === '') {
    throw new Error('Please provide fee receiver address')
  }

  if (linkKey == null || linkKey === '') {
    throw new Error('Please provide link key')
  }

  if (nativeTokensAmount == null || nativeTokensAmount === '') {
    throw new Error('Please provide native tokens amount')
  }

  if (tokensAmount == null || tokensAmount === '') {
    throw new Error('Please provide amount of tokens to claim')
  }
  if (tokenId == null || tokenId === '') {
    throw new Error('Please provide NFT id')
  }

  if (feeAmount == null || feeAmount === '') {
    throw new Error('Please provide fee amount')
  }

  if (expiration == null || expiration === '') {
    throw new Error('Please provide link expiration timestamp')
  }

  if (signerSignature == null || signerSignature === '') {
    throw new Error('Please provide linkdropMaster signature')
  }

  if (receiverAddress == null || receiverAddress === '') {
    throw new Error('Please provide receiver address')
  }

  if (linkdropContract == null || linkdropContract === '') {
    throw new Error('Please provide linkdrop contract address')
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const linkParams = new LinkParams({
    token,
    nft,
    feeToken,
    feeReceiver,
    linkId,
    nativeTokensAmount,
    tokensAmount,
    tokenId,
    feeAmount,
    expiration,
    signerSignature
  })

  const response = await axios.post(`${apiHost}/api/v1/linkdrops/claim`, {
    linkParams,
    receiverAddress,
    receiverSignature,
    linkdropContractAddress: linkdropContract
  })

  const { error, errors, success, txHash } = response.data
  return { error, errors, success, txHash }
}

export const claimAndDeploy = async ({
  jsonRpcUrl,
  apiHost,
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
  sender,
  factory
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }

  if (apiHost == null || apiHost === '') {
    throw new Error('Please provide api host')
  }

  if (nativeTokensAmount == null || nativeTokensAmount === '') {
    throw new Error('Please provide native tokens amount to claim')
  }

  if (token == null || token === '') {
    throw new Error('Please provide token address')
  }

  if (nft == null || nft === '') {
    throw new Error('Please provide NFT address')
  }

  if (feeToken == null || feeToken === '') {
    throw new Error('Please provide fee token address')
  }

  if (feeReceiver == null || feeReceiver === '') {
    throw new Error('Please provide fee receiver address')
  }

  if (linkKey == null || linkKey === '') {
    throw new Error('Please provide link key')
  }

  if (nativeTokensAmount == null || nativeTokensAmount === '') {
    throw new Error('Please provide native tokens amount')
  }

  if (tokensAmount == null || tokensAmount === '') {
    throw new Error('Please provide amount of tokens to claim')
  }
  if (tokenId == null || tokenId === '') {
    throw new Error('Please provide NFT id')
  }

  if (feeAmount == null || feeAmount === '') {
    throw new Error('Please provide fee amount')
  }

  if (expiration == null || expiration === '') {
    throw new Error('Please provide link expiration timestamp')
  }

  if (signerSignature == null || signerSignature === '') {
    throw new Error('Please provide linkdropMaster signature')
  }

  if (receiverAddress == null || receiverAddress === '') {
    throw new Error('Please provide receiver address')
  }

  if (linkdropContract == null || linkdropContract === '') {
    throw new Error('Please provide linkdrop contract address')
  }

  if (sender == null || sender === '') {
    throw new Error('Please provide sender address')
  }

  if (factory == null || factory === '') {
    throw new Error('Please provide factory address')
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const linkParams = new LinkParams({
    token,
    nft,
    feeToken,
    feeReceiver,
    linkId,
    nativeTokensAmount,
    tokensAmount,
    tokenId,
    feeAmount,
    expiration,
    signerSignature
  })

  const response = await axios.post(
    `${apiHost}/api/v1/linkdrops/claimAndDeploy`,
    {
      linkParams,
      receiverAddress,
      receiverSignature,
      linkdropContractAddress: linkdropContract,
      senderAddress: sender,
      factoryAddress: factory
    }
  )

  const { error, errors, success, txHash } = response.data
  return { error, errors, success, txHash }
}

export const getLinkStatus = async ({
  apiHost,
  linkdropContractAddress,
  linkId
}) => {
  const response = await axios.get(
    `${apiHost}/api/v1/linkdrops/getStatus/${linkdropContractAddress}/${linkId}`
  )
  return response.data
}

export const cancelLink = async ({
  apiHost,
  linkdropContractAddress,
  linkId
}) => {
  const response = await axios.post(`${apiHost}/api/v1/linkdrops/cancel`, {
    linkdropContractAddress,
    linkId
  })

  const { error, errors, success, claimOperation } = response.data
  return { error, errors, success, claimOperation }
}
