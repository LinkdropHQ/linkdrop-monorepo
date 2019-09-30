/* global web3 */
import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import initializeSdk from 'data/sdk'
import { factory, claimHost, infuraPk } from 'app.config.js'
import { defineNetworkName } from '@linkdrop/commons'

import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield delay(3000)
    const currentProvider = (web3 || {}).currentProvider
    if (!currentProvider) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    const { selectedAddress, networkVersion } = currentProvider
    if (!selectedAddress || !networkVersion) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    window.addressChangeInterval && window.clearInterval(window.addressChangeInterval)
    const networkName = defineNetworkName({ chainId: networkVersion })
    const sdk = initializeSdk({
      claimHost,
      factoryAddress: factory,
      chainId: networkName,
      linkdropMasterAddress: selectedAddress,
      jsonRpcUrl: `https://${networkName}.infura.io/v3/${infuraPk}`,
      apiHost: `https://${networkName}.linkdrop.io`
    })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    yield put({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress: selectedAddress } })
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId: networkVersion } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    window.addressChangeInterval = window.setInterval(() => {
      const currentMetamaskAddress = web3.eth.accounts[0]
      if (selectedAddress !== currentMetamaskAddress) {
        window.location.reload()
      }
    }, 2000)
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
