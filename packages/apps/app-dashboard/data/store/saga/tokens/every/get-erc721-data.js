import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { jsonRpcUrl } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress } = payload
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc721' } })
    const provider = yield new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
    const symbol = yield tokenContract.symbol()
    yield put({ type: 'TOKENS.SET_SYMBOL', payload: { symbol } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
