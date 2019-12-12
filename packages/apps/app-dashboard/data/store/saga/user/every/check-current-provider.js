import { put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import initializeSdk from 'data/sdk'
import { factory, claimHost, jsonRpcUrlXdai, infuraPk } from 'app.config.js'
import { defineNetworkName, defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { provider, name } = payload
    console.log({ name })
    if (!provider) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }

    yield put({ type: 'USER.SET_WEB3_PROVIDER', payload: { web3Provider: provider } })
    yield put({ type: 'USER.SET_WEB3_PROVIDER_NAME', payload: { web3ProviderName: name } })

    const result = yield provider.eth.getAccounts()
    const chainId = yield provider.eth.getChainId()
    const address = (result || [])[0]
    if (!address || !chainId) {
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    window.addressChangeInterval && window.clearInterval(window.addressChangeInterval)
    const networkName = defineNetworkName({ chainId })
    const jsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const sdk = initializeSdk({
      claimHost,
      factoryAddress: factory,
      chainId: networkName,
      linkdropMasterAddress: address,
      jsonRpcUrl,
      apiHost: `https://${networkName}.linkdrop.io`
    })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    yield put({ type: 'USER.SET_CURRENT_ADDRESS', payload: { currentAddress: address } })
    yield put({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    window.addressChangeInterval = window.setInterval(async () => {
      const currentMetamaskAddress = await provider.eth.getAccounts()
      if ((address || '').toLowerCase() !== ((currentMetamaskAddress || [])[0] || '').toLowerCase()) {
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
