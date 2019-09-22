import { put } from 'redux-saga/effects'
import { initializeWalletSdk } from 'data/sdk'
import config from 'app.config.js'
import { defineNetworkName } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const { chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const sdk = initializeWalletSdk({ chain: networkName, infuraPk: config.infuraPk })
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
