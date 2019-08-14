import { takeEvery } from 'redux-saga/effects'

import createSdk from './every/create-sdk'
import createWallet from './every/create-wallet'
import setUserData from './every/set-user-data'

export default function * () {
  yield takeEvery('*USER.CREATE_SDK', createSdk)
  yield takeEvery('*USER.CREATE_WALLET', createWallet)
  yield takeEvery('*USER.SET_USER_DATA', setUserData)
}
