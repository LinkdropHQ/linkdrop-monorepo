import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import initializeSdk from 'data/sdk'
import { jsonRpcUrl, apiHost, factory, claimHost } from 'app.config.js'
import { defineNetworkName } from '@linkdrop/commons'
import Promise from 'bluebird'
import Web3 from 'web3'


const generator = function * ({ payload }) {
  try {
    console.log(payload)
    const { currentProvider } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    // yield delay(3000)
    if (!currentProvider) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }

    window.web3 = new Web3(currentProvider)
    Promise.promisifyAll(window.web3.eth, { suffix: 'Promise' })
    const accounts = yield window.web3.eth.getAccounts()
    const selectedAddress = accounts[0]

    console.log({ selectedAddress })
    const networkVersion = yield window.web3.eth.net.getId()
    
    if (!selectedAddress || !networkVersion) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    window.addressChangeInterval && window.clearInterval(window.addressChangeInterval)
    const networkName = defineNetworkName({ chainId: networkVersion })
    const sdk = initializeSdk({ claimHost, factoryAddress: factory, chainId: networkName, linkdropMasterAddress: selectedAddress, jsonRpcUrl, apiHost })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    yield put({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress: selectedAddress } })
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId: networkVersion } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    // window.addressChangeInterval = window.setInterval(async () => {
    //   const currentAddress = currentProvider.selectedAddress || (await window.web3.eth.getAccounts())[0]
    //   if (selectedAddress !== currentAddress) {
    //     window.location.reload()
    //   }
    // }, 2000)
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  step: ({ user: { step } }) => step
}
