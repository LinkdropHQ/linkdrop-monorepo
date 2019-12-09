import { takeEvery } from 'redux-saga/effects'
import createSdk from './every/create-sdk'
import createInitialData from './every/create-initial-data'
import clearData from './every/clear-data'

export default function * () {
  yield takeEvery('*USER.CREATE_SDK', createSdk)
  yield takeEvery('*USER.CREATE_INITIAL_DATA', createInitialData)
  yield takeEvery('*USER.CLEAR_DATA', clearData) 
}
