import { put } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'

const generator = function * ({ payload }) {
  try {
    const { wallet } = payload
    const sdk = yield initializeSdk({
      senderAddress: wallet,
      factoryAddress: '0xd8A0d5C630A73f2bC2DC0C8fcc53032Df4c635D2',
      apiHost: 'http://rinkeby.linkdrop.io:20003'
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
