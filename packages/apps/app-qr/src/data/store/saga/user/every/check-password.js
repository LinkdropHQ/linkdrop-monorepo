import { put, select } from 'redux-saga/effects'
const DOUBLE_HASH = '0059d00239ebbf12a19b30df61f9fe81c40e7796535a3478182555c0b0722bc5'
const sha3256 = require('js-sha3').sha3_256

const generator = function * ({ payload }) {
  try {
  	const { password, email } = payload
  	const currentPassword = yield select(generator.selectors.savedPassword)
  	if (currentPassword && sha3256(currentPassword) === DOUBLE_HASH) {
  		return yield put({ type: '*USER.GENERATE_LINK', payload: { password: currentPassword, email } })
  	} else {
      yield put(({ type: 'USER.SET_ERROR', payload: { error: 'INVALID_PASSWORD_PROVIDED' } }))
      alert('INVALID_PASSWORD_PROVIDED')
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  savedPassword: ({ user: { password } }) => password
}
