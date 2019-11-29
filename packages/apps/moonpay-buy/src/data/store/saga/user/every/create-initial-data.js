import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'

const generator = function * () {
  try {
    const newWallet = ethers.Wallet.createRandom()
    const { address: wallet, privateKey } = newWallet
    yield put({ type: 'USER.SET_WALLET', payload: { wallet } })
    yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
    yield put({ type: '*USER.CREATE_SDK', payload: { wallet } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
