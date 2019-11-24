import { put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { tokenAmount, ethAmount, linksAmount, tokenSymbol, wallet } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'CAMPAIGNS.SET_TOKEN_AMOUNT', payload: { tokenAmount } })
    yield put({ type: 'CAMPAIGNS.SET_DEFAULT_WALLET', payload: { defaultWallet: wallet } })
    yield put({ type: 'CAMPAIGNS.SET_TOKEN_SYMBOL', payload: { tokenSymbol } })
    yield put({ type: 'CAMPAIGNS.SET_DATE', payload: { date: new Date() } })
    yield put({ type: 'CAMPAIGNS.SET_ETH_AMOUNT', payload: { ethAmount } })
    yield put({ type: 'CAMPAIGNS.SET_LINKS_AMOUNT', payload: { linksAmount } })
    yield put({ type: 'CAMPAIGNS.SET_TOKEN_TYPE', payload: { tokenType: 'erc20' } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 2 } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
