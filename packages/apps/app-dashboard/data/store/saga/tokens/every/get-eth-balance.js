import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { jsonRpcUrl } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { account } = payload
    const provider = yield new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const ethBalance = yield provider.getBalance(account)

    // check of ethereum balance
    const ethBalanceFormatted = utils.formatEther(ethBalance)
    if (Number(ethBalanceFormatted) > 0) {
      yield put({ type: 'TOKENS.SET_ETH_BALANCE', payload: { ethBalanceFormatted, ethBalance } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
