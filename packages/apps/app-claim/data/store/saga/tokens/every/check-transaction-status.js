import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { jsonRpcUrl } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const { transactionId } = payload
    const provider = yield new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const receipt = yield provider.getTransactionReceipt(transactionId)
    if (receipt && receipt.confirmations != null && receipt.confirmations > 0) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'claimed' } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
