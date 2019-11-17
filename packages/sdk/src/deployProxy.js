import LinkdropFactory from '@linkdrop/contracts/build/LinkdropFactory.json'
import { ethers } from 'ethers'

export const connectToFactoryContract = async ({
  jsonRpcUrl,
  factoryAddress,
  signingKeyOrWallet
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }
  if (factoryAddress == null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error('Please provide signing key or wallet')
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet, provider)
  }

  return new ethers.Contract(
    factoryAddress,
    LinkdropFactory.abi,
    signingKeyOrWallet
  )
}

export const deployProxy = async ({
  jsonRpcUrl,
  factoryAddress,
  signingKeyOrWallet,
  campaignId,
  nativeTokensAmount
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }
  if (factoryAddress == null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error('Please provide signing key or wallet')
  }
  if (campaignId == null || campaignId === '') {
    throw new Error('Please provide campaign id')
  }
  if (nativeTokensAmount == null || nativeTokensAmount === '') {
    throw new Error('Please provide native tokens amount')
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet, provider)
  }

  const factoryContract = await connectToFactoryContract({
    jsonRpcUrl,
    factoryAddress,
    signingKeyOrWallet
  })

  if (nativeTokensAmount > 0) {
    const data = factoryContract.interface.functions.deployProxy.encode(
      campaignId
    )
    return signingKeyOrWallet.sendTransaction({
      to: factoryAddress,
      value: nativeTokensAmount,
      data
    })
  }

  return factoryContract.deployProxy(campaignId)
}
