import { put } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'

const generator = function * ({ payload }) {
  try {
    const { wallet } = payload
    const sdk = yield initializeSdk({
      senderAddress: wallet,
      factoryAddress: '0xED0435532B24eECf225514c74f78B9F7eCfe88c0',
      apiHost: 'http://ropsten-v2.linkdrop.io'
    })
    if (sdk) {
      yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet,
  privateKey: ({ user: { privateKey } }) => privateKey
}
