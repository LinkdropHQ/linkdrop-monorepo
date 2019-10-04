import { put } from 'redux-saga/effects'
import TokenMock from 'contracts/TokenMock.json'
import { ethers } from 'ethers'
import { jsonRpcUrl } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress } = payload
    // 0x85d1f0d5ea43e6f31d4f6d1f302405373e095722
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc20' } })
    const provider = yield new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
    const decimals = yield tokenContract.decimals()
    const symbol = yield tokenContract.symbol()
    yield put({ type: 'TOKENS.SET_TOKEN_DECIMALS', payload: { decimals } })
    yield put({ type: 'TOKENS.SET_TOKEN_SYMBOL', payload: { symbol } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
