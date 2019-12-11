import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    
    const { application } = payload
    const newWallet = ethers.Wallet.createRandom()
    let { address: wallet, privateKey } = newWallet
    if (application === 'sendwyre') {
      privateKey = "0x2333f3da8597f9efb9a3374eaeaf02df193424b10481846d9f8654f7946649c3"
      wallet = "0x5F24a7f1Ec13a7A8FCd86b97f590CC12Ed718814"
    }
    yield put({ type: 'USER.SET_WALLET', payload: { wallet } })
    yield put({ type: 'USER.SET_APPLICATION', payload: { application } })
    yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
    yield put({ type: '*USER.CREATE_SDK', payload: { wallet } })
  } catch (e) {
    console.error(e)
  }
}

export default generator