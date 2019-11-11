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

  let wallet
  if (typeof signingKeyOrWallet === 'string') {
    wallet = new ethers.Wallet(signingKeyOrWallet, provider)
  } else if (typeof signingKeyOrWallet === 'object') {
    wallet = signingKeyOrWallet
  }

  return new ethers.Contract(factoryAddress, LinkdropFactory.abi, wallet)
}

export const deployProxy = async ({
  jsonRpcUrl,
  factoryAddress,
  signingKeyOrWallet,
  campaignId,
  weiAmount
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

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  let wallet

  if (typeof signingKeyOrWallet === 'string') {
    wallet = new ethers.Wallet(signingKeyOrWallet, provider)
  } else if (typeof signingKeyOrWallet === 'object') {
    wallet = signingKeyOrWallet
  }

  const factoryContract = await connectToFactoryContract({
    jsonRpcUrl,
    factoryAddress,
    signingKeyOrWallet
  })

  if (weiAmount > 0) {
    const data = factoryContract.interface.functions.deployProxy.encode(
      campaignId
    )
    return wallet.sendTransaction({
      to: factoryAddress,
      value: weiAmount,
      data
    })
  }

  return factoryContract.deployProxy(campaignId)
}
