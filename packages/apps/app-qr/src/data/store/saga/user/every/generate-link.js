import { put, call } from 'redux-saga/effects'
const sha3256 = require('js-sha3').sha3_256
import { generateLink } from 'data/api/link'

const generator = function * ({ payload }) {
  try {
  	const { password, email } = payload
    const hashedPassword = sha3256(password)
    console.log({ hashedPassword })
    const { success, user, link, message } = yield call(generateLink, { passwordHash: hashedPassword, email })
  	if (!success) {
  		console.log(ERRORS[message])
  		yield put(({ type: 'USER.SET_ERROR', payload: { error: ERRORS[message] } }))
  	} else {
  		yield put(({ type: 'USER.SET_LINK', payload: { link } }))
  	}
  	yield put(({ type: 'USER.SET_LOADING', payload: { loading: false } }))
  } catch (e) {
    console.error(e)
  }
}

export default generator

const ERRORS = {
	'Email should be provided': 'EMAIL_SHOULD_BE_PROVIDED',
	'Invalid password hash provided': 'INVALID_PASSWORD_PROVIDED',
	'User with provided email already exists': 'USER_ALREADY_EXISTS'
}
