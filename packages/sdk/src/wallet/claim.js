import axios from 'axios'
import { ethers } from 'ethers'
import { signReceiverAddress } from '../utils'

export const claim = async ({
  jsonRpcUrl,
  apiHost,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  linkKey,
  linkdropMasterAddress,
  linkdropSignerSignature,
  receiverAddress,
  campaignId
}) => {
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
    linkId,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    campaignId
  }
  console.log('claimParams: ', claimParams)

  const response = await axios.post(
    `${apiHost}/api/v1/safes/claimAndCreate`,
    claimParams
  )

  const { error, errors, success, txHash } = response.data
  return { error, errors, success, txHash }
}
