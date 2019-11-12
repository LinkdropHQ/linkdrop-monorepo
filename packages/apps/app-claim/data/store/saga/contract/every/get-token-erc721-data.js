import { put, call } from 'redux-saga/effects'
import { getERC721TokenData } from 'data/api/tokens'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'

const getImage = function * ({ metadataURL }) {
  try {
    const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    return data.image
  } catch (error) {
    console.error(e)
    return ''
  }
}

const getContractData = function * ({ tokenId, nftContract }) {
  try {
    return yield nftContract.tokenURI(tokenId)
  } catch (e) {
    console.error(e)
    return ''
  }
}

const getSymbol = function * ({ nftContract, nftAddress }) {
  try {
    return yield nftContract.symbol()
  } catch (e) {
    console.error(e)
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
    const { nftAddress, tokenId, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    const metadataURL = yield getContractData({ tokenId, nftContract })
    const name = yield getSymbol({ nftContract, nftAddress })
    if (metadataURL !== '') {
      image = yield getImage({ metadataURL })
    }
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: name } })

    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })

    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
    const { nftAddress, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, NFTMock.abi, provider)
    const name = yield nftContract.symbol()
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: name } })
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  }
}

export default generator
