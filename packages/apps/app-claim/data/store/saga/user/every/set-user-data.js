import { put } from 'redux-saga/effects'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    const { privateKey, contractAddress, ens, avatar } = payload
    yield put({ type: 'USER.SET_USER_DATA', payload: { privateKey, contractAddress, ens, avatar } })
    if (ls && ls.setItem) {
      ls.setItem('privateKey', privateKey)
      ls.setItem('contractAddress', contractAddress)
      ls.setItem('ens', ens)
      ls.setItem('avatar', avatar)
    }
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
