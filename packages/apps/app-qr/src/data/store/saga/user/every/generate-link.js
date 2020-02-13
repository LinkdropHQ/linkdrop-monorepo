import { put, call } from 'redux-saga/effects'
import { generateLink } from 'data/api/link'
const sha3256 = require('js-sha3').sha3_256

const generator = function * ({ payload }) {
  try {
    const password = sha3256('onboarding')
  	const { email } = payload
    const { success, user, link, message } = yield call(generateLink, { passwordHash: password, email })
  	if (!success) {
  		console.log(ERRORS[message])
  		yield put(({ type: 'USER.SET_ERROR', payload: { error: ERRORS[message] } }))
  	} else {
      window.location.href = link
  		// yield put(({ type: 'USER.SET_LINK', payload: { link } }))
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
