import { ethers } from 'ethers'
import TokenMock from '../../contracts/build/TokenMock.json'
import NFTMock from '../../contracts/build/NFTMock.json'

export const topup = async ({
  jsonRpcUrl,
  signingKeyOrWallet,
  proxyAddress,
  nativeTokensAmount
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error('Please provide signing key or wallet')
  }
  if (proxyAddress == null || proxyAddress === '') {
    throw new Error('Please provide proxy address')
  }
  if (nativeTokensAmount == null || nativeTokensAmount === '') {
    throw new Error('Please provide native tokens amount')
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet, provider)
  }

  const tx = await signingKeyOrWallet.sendTransaction({
    to: proxyAddress,
    value: nativeTokensAmount
  })

  return tx.hash
}

export const approve = async ({
  jsonRpcUrl,
  signingKeyOrWallet,
  proxyAddress,
  tokenAddress,
  tokensAmount
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error('Please provide signing key or wallet')
  }
  if (proxyAddress == null || proxyAddress === '') {
    throw new Error('Please provide proxy address')
  }
  if (tokenAddress == null || tokenAddress === '') {
    throw new Error('Please provide token address')
  }
  if (tokensAmount == null || tokensAmount === '') {
    throw new Error('Please provide tokens amount')
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet, provider)
  }

  const tokenContract = new ethers.Contract(
    tokenAddress,
    TokenMock.abi,
    signingKeyOrWallet
  )
  const tx = await tokenContract.approve(proxyAddress, tokensAmount)

  return tx.hash
}

export const approveNFT = async ({
  jsonRpcUrl,
  signingKeyOrWallet,
  proxyAddress,
  nftAddress
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error('Please provide json rpc url')
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error('Please provide signing key or wallet')
  }
  if (proxyAddress == null || proxyAddress === '') {
    throw new Error('Please provide proxy address')
  }
  if (nftAddress == null || nftAddress === '') {
    throw new Error('Please provide nft address')
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet, provider)
  }
  const nftContract = new ethers.Contract(
    nftAddress,
    NFTMock.abi,
    signingKeyOrWallet
  )
  const tx = await nftContract.setApprovalForAll(proxyAddress, true)

  return tx.hash
}
