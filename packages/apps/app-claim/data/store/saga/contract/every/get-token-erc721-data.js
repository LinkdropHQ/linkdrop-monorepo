import { put, call } from 'redux-saga/effects'
import { getERC721TokenData } from 'data/api/tokens'
import { ethers } from 'ethers'
import NFTMock from '@linkdrop/contracts/build/NFTMock.json'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'

const getImage = function * ({ metadataURL }) {
  try {
    const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    return data.image
  } catch (error) {
    return ''
  }
}

const generator = function * ({ payload }) {
  let image = +(new Date())
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { nft, tokenId, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nft, NFTMock.abi, provider)
    const metadataURL = yield nftContract.tokenURI(tokenId)
    const name = yield nftContract.symbol()
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
    const { nft, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nft, NFTMock.abi, provider)
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
