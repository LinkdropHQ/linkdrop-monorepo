import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { address } = payload
    const assetsERC721 = yield select(generator.selectors.assetsERC721)
    const { symbol } = assetsERC721.find(({ address: tokenAddress }) => tokenAddress === address)
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address } })
    yield put({ type: 'TOKENS.SET_TOKEN_TYPE', payload: { tokenType: 'erc721' } })
    yield put({ type: 'TOKENS.SET_TOKEN_SYMBOL', payload: { symbol } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  assetsERC721: ({ tokens: { assetsERC721 } }) => assetsERC721
}
