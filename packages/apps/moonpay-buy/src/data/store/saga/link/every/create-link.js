import { put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'LINK.SET_LOADING', payload: { loading: true } })
    yield delay(5000)
    yield put({ type: 'LINK.SET_LINK', payload: { link: 'https://linkdrop.io' } })
    yield put({ type: 'LINK.SET_PAGE', payload: { page: 'finished' } })
    yield put({ type: 'LINK.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
