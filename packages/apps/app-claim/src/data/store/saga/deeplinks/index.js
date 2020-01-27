import { takeEvery } from 'redux-saga/effects'

import getCoinbaseLink from './every/get-coinbase-link'

export default function * () {
  yield takeEvery('*DEEPLINKS.GET_COINBASE_LINK', getCoinbaseLink)
}
