import { takeEvery } from 'redux-saga/effects'

import claim from './every/claim'
import checkTransactionStatus from './every/check-transaction-status'
import checkIfClaimed from './every/check-if-claimed'

export default function * () {
  yield takeEvery('*TOKENS.CLAIM', claim)
  yield takeEvery('*TOKENS.CHECK_TRANSACTION_STATUS', checkTransactionStatus)
  yield takeEvery('*TOKENS.CHECK_IF_CLAIMED', checkIfClaimed)
}
