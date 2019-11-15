import { takeEvery } from 'redux-saga/effects'

import checkBalance from './every/check-balance'

export default function * () {
  yield takeEvery('*ASSETS.CHECK_BALANCE', checkBalance)
}
