import { takeEvery } from 'redux-saga/effects'
import checkPassword from './every/check-password'
import generateLink from './every/generate-link'


export default function * () {
  yield takeEvery('*USER.CHECK_PASSWORD', checkPassword)
  yield takeEvery('*USER.GENERATE_LINK', generateLink)
}
