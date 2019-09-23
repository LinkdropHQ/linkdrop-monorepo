import { ethers } from 'ethers'
import TokenMock from '../../contracts/build/TokenMock.json'
import NFTMock from '../../contracts/build/NFTMock.json'

export const topup = async ({
  jsonRpcUrl,
  signingKeyOrWallet,
  proxyAddress,
  weiAmount
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error(`Please provide json rpc url`)
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error(`Please provide signing key or wallet`)
  }
  if (proxyAddress == null || proxyAddress === '') {
    throw new Error(`Please provide proxy address`)
  }
  if (weiAmount == null || weiAmount === '') {
    throw new Error(`Please provide wei amount`)
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  let wallet
  if (typeof signingKeyOrWallet === 'string') {
    wallet = new ethers.Wallet(signingKeyOrWallet, provider)
  } else if (typeof signingKeyOrWallet === 'object') {
    wallet = signingKeyOrWallet
  }

  const tx = await wallet.sendTransaction({
    to: proxyAddress,
    value: weiAmount
  })

  return tx.hash
}

export const approve = async ({
  jsonRpcUrl,
  signingKeyOrWallet,
  proxyAddress,
  tokenAddress,
  tokenAmount
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error(`Please provide json rpc url`)
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error(`Please provide signing key or wallet`)
  }
  if (proxyAddress == null || proxyAddress === '') {
    throw new Error(`Please provide proxy address`)
  }
  if (tokenAddress == null || tokenAddress === '') {
    throw new Error(`Please provide token address`)
  }
  if (tokenAmount == null || tokenAmount === '') {
    throw new Error(`Please provide token amount`)
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  let wallet
  if (typeof signingKeyOrWallet === 'string') {
    wallet = new ethers.Wallet(signingKeyOrWallet, provider)
  } else if (typeof signingKeyOrWallet === 'object') {
    wallet = signingKeyOrWallet
  }

  const tokenContract = new ethers.Contract(tokenAddress, TokenMock.abi, wallet)
  const tx = await tokenContract.approve(proxyAddress, tokenAmount)

  return tx.hash
}

export const approveERC721 = async ({
  jsonRpcUrl,
  signingKeyOrWallet,
  proxyAddress,
  nftAddress
}) => {
  if (jsonRpcUrl == null || jsonRpcUrl === '') {
    throw new Error(`Please provide json rpc url`)
  }
  if (signingKeyOrWallet == null || signingKeyOrWallet === '') {
    throw new Error(`Please provide signing key or wallet`)
  }
  if (proxyAddress == null || proxyAddress === '') {
    throw new Error(`Please provide proxy address`)
  }
  if (nftAddress == null || nftAddress === '') {
    throw new Error(`Please provide nft address`)
  }

  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  let wallet

  if (typeof signingKeyOrWallet === 'string') {
    wallet = new ethers.Wallet(signingKeyOrWallet, provider)
  } else if (typeof signingKeyOrWallet === 'object') {
    wallet = signingKeyOrWallet
  }

  const nftContract = new ethers.Contract(nftAddress, NFTMock.abi, wallet)
  const tx = await nftContract.setApprovalForAll(proxyAddress, true)

  return tx.hash
}
