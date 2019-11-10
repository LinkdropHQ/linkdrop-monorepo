import { ethers } from 'ethers'
import Linkdrop from '@linkdrop/contracts/build/Linkdrop'

export const subscribeForClaimEvents = (
  { jsonRpcUrl, proxyAddress },
  callback
) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const contract = new ethers.Contract(proxyAddress, Linkdrop.abi, provider)
  contract.on('Claimed', callback)
}
