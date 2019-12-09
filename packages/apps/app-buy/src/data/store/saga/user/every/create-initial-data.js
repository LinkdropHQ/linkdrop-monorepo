import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const newWallet = ethers.Wallet.createRandom()
    const { application } = payload
    const { address: wallet, privateKey } = newWallet
    yield put({ type: 'USER.SET_WALLET', payload: { wallet } })
    yield put({ type: 'USER.SET_APPLICATION', payload: { application } })
    yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
    yield put({ type: '*USER.CREATE_SDK', payload: { wallet } })
  } catch (e) {
    console.error(e)
  }
}

export default generator