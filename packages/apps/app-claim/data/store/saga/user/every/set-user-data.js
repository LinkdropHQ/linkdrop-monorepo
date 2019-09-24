import { put } from 'redux-saga/effects'
import { saveUserData } from 'helpers'

const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { privateKey, contractAddress, ens, avatar, chainId } = payload
    yield put({ type: 'USER.SET_USER_DATA', payload: { privateKey, contractAddress, ens, avatar } })
    if (ls && ls.setItem) {
      saveUserData({ privateKey, contractAddress, ens, chainId, avatar })
    }
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
