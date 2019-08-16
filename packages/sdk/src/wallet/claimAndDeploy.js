import { signReceiverAddress } from './utils'
import { ethers } from 'ethers'
import axios from 'axios'
import LinkdropFactory from '../../../contracts/build/LinkdropFactory.json'

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

export const claimAndDeploy = async ({
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
  receiverAddress, // precomputed wallet address
  factoryAddress,
  campaignId,
  walletFactory,
  publicKey,
  initializeWithENS,
  signature
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

  if (walletFactory === null || walletFactory === '') {
    throw new Error('Please provide wallet factory address')
  }

  if (publicKey === null || publicKey === '') {
    throw new Error('Please provide public key')
  }

  if (initializeWithENS === null || initializeWithENS === '') {
    throw new Error('Please provide initialize with ens data')
  }

  if (signature === null || signature === '') {
    throw new Error('Please provide signature ')
  }

  // Get provider
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  // Get receiver signature
  const receiverSignature = await signReceiverAddress(linkKey, receiverAddress)

  // Get linkId from linkKey
  const linkId = new ethers.Wallet(linkKey, provider).address

  const claimData = await new ethers.utils.Interface(
    LinkdropFactory.abi
  ).functions.claim.encode([
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  ])

  console.log('claimData: ', claimData)

  const claimAndDeployParams = {
    claimData,
    walletFactory,
    publicKey,
    initializeWithENS,
    signature
  }

  const response = await axios.post(
    `${apiHost}/api/v1/linkdrops/deployAndClaim`,
    claimAndDeployParams
  )

  const { error, errors, success, txHash } = response.data
  return { error, errors, success, txHash }
}
