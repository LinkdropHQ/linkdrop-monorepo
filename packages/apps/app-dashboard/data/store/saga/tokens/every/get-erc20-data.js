import { put } from 'redux-saga/effects'
import TokenMock from 'contracts/TokenMock.json'
import { ethers } from 'ethers'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const defineSymbol = function * ({ tokenContract, tokenAddress }) {
  try {
    const symbol = yield tokenContract.symbol()
    return symbol
  } catch (e) {
    if (tokenAddress === '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359') {
      return 'DAI'
    }
    return 'ERC20'
  }
}

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenAddress, chainId } = payload
    // 0x85d1f0d5ea43e6f31d4f6d1f302405373e095722
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: tokenAddress } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc20' } })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
    const decimals = yield tokenContract.decimals()
    const symbol = yield defineSymbol({ tokenAddress, tokenContract })
    yield put({ type: 'TOKENS.SET_TOKEN_DECIMALS', payload: { decimals } })
    yield put({ type: 'TOKENS.SET_TOKEN_SYMBOL', payload: { symbol } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
