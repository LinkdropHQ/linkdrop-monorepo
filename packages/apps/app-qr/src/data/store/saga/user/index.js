import { takeEvery } from 'redux-saga/effects'
import checkPassword from './every/check-password'
import generateLink from './every/generate-link'
import setNewPassword from './every/set-new-password'


export default function * () {
  yield takeEvery('*USER.CHECK_PASSWORD', checkPassword)
  yield takeEvery('*USER.SET_NEW_PASSWORD', setNewPassword)
  yield takeEvery('*USER.GENERATE_LINK', generateLink)
}
