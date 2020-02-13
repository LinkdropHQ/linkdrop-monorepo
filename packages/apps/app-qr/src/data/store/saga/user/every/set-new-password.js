import { put } from 'redux-saga/effects'
const DOUBLE_HASH = '0059d00239ebbf12a19b30df61f9fe81c40e7796535a3478182555c0b0722bc5'
const sha3256 = require('js-sha3').sha3_256
const ls = window.localStorage

const generator = function * ({ payload }) {
  try {
  	const { password, email } = payload  
  	console.log({ password, email }) 
    const hashedPassword = sha3256(password)
    const passwordDoubleHashed = sha3256(hashedPassword)
    if (passwordDoubleHashed === DOUBLE_HASH) {
    	ls && ls.setItem('password', hashedPassword)
    	yield put(({ type: 'USER.SET_PASSWORD', payload: { password: hashedPassword } }))
    	yield put({ type: '*USER.GENERATE_LINK', payload: { password: hashedPassword, email } })
    } else {
    	yield put(({ type: 'USER.SET_ERROR', payload: { error: 'INVALID_PASSWORD_PROVIDED' } }))
    	alert('INVALID_PASSWORD_PROVIDED')
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
