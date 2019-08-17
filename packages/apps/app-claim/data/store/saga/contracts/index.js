import { takeEvery } from 'redux-saga/effects'

import deploy from './every/deploy'

export default function * () {
  yield takeEvery('*CONTRACTS.DEPLOY', deploy)
}
