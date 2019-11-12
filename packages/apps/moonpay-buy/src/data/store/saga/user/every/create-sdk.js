import { put, select } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'

const generator = function * ({ payload }) {
  try {
    const { wallet } = payload
    const sdk = initializeSdk({
      senderAddress: wallet,
      factoryAddress: '0xc3cF547AEDFcACB8bcbF453E028aFfc72a7d81a2',
      apiHost: 'http://rinkeby.linkdrop.io:20004'
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
