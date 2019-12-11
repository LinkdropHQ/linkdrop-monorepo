import { put, call } from 'redux-saga/effects'
import { getERC721TokenData, getERC721AssetData } from 'data/api/tokens'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'

const getImage = function * ({ metadataURL, nftAddress, tokenId, chainId }) {
  try {
    if (Number(chainId) === 1 && nftAddress.toLowerCase() === '0xc94edae65cd0e07c17e7e1b6afb46589297313ae') {
      const assetData = yield call(getERC721AssetData, { tokenAddress: nftAddress, tokenId })
      const { image_preview_url: imageUrl } = assetData
      if (imageUrl) {
        return imageUrl
      }
    }
    const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    return data.image
  } catch (err) {
    console.error(err)
    return ''
  }
}

const getContractData = function * ({ tokenId, nftContract }) {
  try {
    return yield nftContract.tokenURI(tokenId)
  } catch (err) {
    console.error(err)
    return ''
  }
}

const getSymbol = function * ({ nftContract, nftAddress, tokenId, chainId }) {
  try {
    if (Number(chainId) === 1 && nftAddress.toLowerCase() === '0xc94edae65cd0e07c17e7e1b6afb46589297313ae') {
      const assetData = yield call(getERC721AssetData, { tokenAddress: nftAddress, tokenId })
      const { name } = assetData
      if (name) {
        return name
      }
    }
    return yield nftContract.symbol()
  } catch (err) {
    console.error(err)
    if (nftAddress === '0xfac7bea255a6990f749363002136af6556b31e04') {
      return 'ENS'
    }
    return 'ERC721'
  }
}

const generator = function * ({ payload }) {
  let image = +(new Date())
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { nftAddress, tokenId, chainId, name: linkFromName } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    const metadataURL = yield getContractData({ tokenId, nftContract })
    const name = yield getSymbol({ nftContract, nftAddress, tokenId, chainId })
    if (metadataURL !== '') {
      image = yield getImage({ metadataURL, nftAddress, tokenId, chainId })
    }
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: linkFromName || name } })

    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })

    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
    const { nftAddress, chainId, name: linkFromName } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    const name = yield getSymbol({ nftContract, nftAddress })
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: linkFromName || name } })
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  }
}

export default generator
