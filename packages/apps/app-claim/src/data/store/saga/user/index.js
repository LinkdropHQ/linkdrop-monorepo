import { takeEvery } from 'redux-saga/effects'

import createSdk from './every/create-sdk'

export default function * () {
  yield takeEvery('*USER.CREATE_SDK', createSdk)
}
