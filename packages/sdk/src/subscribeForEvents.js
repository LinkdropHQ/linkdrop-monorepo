import { ethers } from 'ethers'
import LinkdropMastercopy from '@linkdrop/contracts/build/LinkdropMastercopy'

export const subscribeForClaimedEvents = (
  { jsonRpcUrl, proxyAddress },
  callback
) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const contract = new ethers.Contract(
    proxyAddress,
    LinkdropMastercopy.abi,
    provider
  )
  contract.on('Claimed', callback)
}

export const subscribeForClaimedERC721Events = (
  { jsonRpcUrl, proxyAddress },
  callback
) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const contract = new ethers.Contract(
    proxyAddress,
    LinkdropMastercopy.abi,
    provider
  )
  contract.on('ClaimedERC721', callback)
}
