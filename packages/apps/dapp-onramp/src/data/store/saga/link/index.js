import { takeEvery } from 'redux-saga/effects'

import createLink from './every/create-link'

export default function * () {
  yield takeEvery('*LINK.CREATE_LINK', createLink)
}
