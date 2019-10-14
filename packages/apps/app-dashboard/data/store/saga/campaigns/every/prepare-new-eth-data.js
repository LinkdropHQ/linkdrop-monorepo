import { put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { ethAmount, linksAmount, tokenType, tokenSymbol } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'CAMPAIGNS.SET_TOKEN_SYMBOL', payload: { tokenSymbol } })
    yield put({ type: 'CAMPAIGNS.SET_TOKEN_TYPE', payload: { tokenType } })
    yield put({ type: 'CAMPAIGNS.SET_ETH_AMOUNT', payload: { ethAmount } })
    yield put({ type: 'CAMPAIGNS.SET_DATE', payload: { date: new Date() } })
    yield put({ type: 'CAMPAIGNS.SET_LINKS_AMOUNT', payload: { linksAmount } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 2 } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
