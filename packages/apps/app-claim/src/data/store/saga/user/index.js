import { takeEvery } from 'redux-saga/effects'
import createSdk from './every/create-sdk'
import sendData from './every/send-data'

export default function * () {
  yield takeEvery('*USER.CREATE_SDK', createSdk)
  yield takeEvery('*USER.SEND_DATA', sendData)
}
