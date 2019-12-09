import { takeEvery } from 'redux-saga/effects'

import createLink from './every/create-link'
import checkIfClaimed from './every/check-if-claimed'

export default function * () {
  yield takeEvery('*LINK.CREATE_LINK', createLink)
  yield takeEvery('*LINK.CHECK_IF_CLAIMED', checkIfClaimed)
}
