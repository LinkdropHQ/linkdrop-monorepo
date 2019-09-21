import { takeEvery } from 'redux-saga/effects'
import confirmTx from './every/confirm-tx'
import connectToDapp from './every/connect-to-dapp'
import close from './every/close'
import show from './every/show'
import hide from './every/hide'
import confirm from './every/confirm'

export default function * () {
  yield takeEvery('*WIDGET.CONFIRM_TX', confirmTx)
  yield takeEvery('*WIDGET.CONNECT_TO_DAPP', connectToDapp)

  yield takeEvery('*WIDGET.SHOW', show)
  yield takeEvery('*WIDGET.HIDE', hide)
  yield takeEvery('*WIDGET.CLOSE', close)
  yield takeEvery('*WIDGET.CONFIRM', confirm)
}
