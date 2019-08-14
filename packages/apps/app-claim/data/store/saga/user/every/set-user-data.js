import { put } from 'redux-saga/effects'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { privateKey, contractAddress, ens } = payload
    yield put({ type: 'USER.SET_USER_DATA', payload: { privateKey, contractAddress, ens } })
    if (ls && ls.setItem) {
      ls.getItem('privateKey', privateKey)
      ls.getItem('contractAddress', contractAddress)
      ls.getItem('ens', ens)
    }
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
