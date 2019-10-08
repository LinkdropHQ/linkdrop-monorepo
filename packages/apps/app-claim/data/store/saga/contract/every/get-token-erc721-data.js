import { put, call } from 'redux-saga/effects'
import { getERC721TokenData, ipfs } from 'data/api/tokens'
import { ethers } from 'ethers'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'

const nftAbi = [
  'function name() view returns (string)',
  'function tokenURI(uint _id) view returns (string)'
]

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
  let metadataName
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { nftAddress, tokenId, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, nftAbi, provider)
    const metadataURL = yield nftContract.tokenURI(tokenId)

    const name = yield nftContract.name()
    if (metadataURL !== '') {
      image = yield getImage({ metadataURL })
      const metadata = yield call(ipfs, { hash: metadataURL })
      metadataName = metadata.name
      image = `https://storage.snark.art/ipfs/${metadata.image}`
    }
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: name } })
    yield put({ type: 'CONTRACT.SET_NAME', payload: { name: metadataName } })
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
    const { nftAddress, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const nftContract = yield new ethers.Contract(nftAddress, nftAbi, provider)
    const name = yield nftContract.symbol()
    yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol: name } })
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon: image } })
    yield put({ type: 'CONTRACT.SET_NAME', payload: { name: null } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: undefined } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  }
}

export default generator
