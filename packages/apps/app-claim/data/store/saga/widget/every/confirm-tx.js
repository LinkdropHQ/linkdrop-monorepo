import { select, put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const sdk = yield select(generator.selectors.sdk)
    const { privateKey, contractAddress } = yield select(generator.selectors.userData)
    const txParams = yield select(generator.selectors.txParams)
    const {
      data,
      to,
      value
    } = txParams

    const message = {
      from: contractAddress,
      data: data || '0x0',
      to: to || '0x0',
      operationType: 0,
      value: value || '0x0'
    }
    const { txHash, success, errors } = yield sdk.execute(message, privateKey)
    yield put({ type: '*WIDGET.CONFIRM', payload: { txHash, success, errors } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  userData: ({ user: { privateKey, contractAddress } }) => ({ privateKey, contractAddress }),
  txParams: ({ widget: { txParams } }) => txParams
}
