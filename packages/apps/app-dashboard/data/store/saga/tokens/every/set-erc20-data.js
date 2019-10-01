import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { tokenSymbol } = payload
    // 0x85d1f0d5ea43e6f31d4f6d1f302405373e095722
    const assets = yield select(generator.selectors.assets)
    const { symbol, decimals, address } = assets.find(asset => asset.symbol === tokenSymbol)
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc20' } })
    yield put({ type: 'TOKENS.SET_TOKEN_DECIMALS', payload: { decimals } })
    yield put({ type: 'TOKENS.SET_TOKEN_SYMBOL', payload: { symbol } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  assets: ({ tokens: { assets } }) => assets
}
