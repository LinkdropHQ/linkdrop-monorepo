import { put } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'
import { defineNetworkName, defineJsonRpcUrl } from '@linkdrop/commons'
import {
  jsonRpcUrlXdai,
  infuraPk,
  factory,
  defaultChainId,
  claimHost
} from 'config'

console.log({ factory })

const generator = function * ({ payload }) {
  try {
    const { wallet } = payload
    const networkName = defineNetworkName({ chainId: defaultChainId })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId: defaultChainId, infuraPk, jsonRpcUrlXdai })
    const sdk = yield initializeSdk({
      senderAddress: wallet,
      factoryAddress: factory,
      jsonRpcUrl: actualJsonRpcUrl,
      claimHost,
      apiHost: `https://${networkName}-v2.linkdrop.io`
    })

    if (sdk) {
      const proxyAddress = sdk.getProxyAddress()
      console.log({ wallet, proxyAddress })
      yield put({ type: 'USER.SET_SDK', payload: { sdk } })
      yield put({ type: 'USER.SET_PROXY_ADDRESS', payload: { proxyAddress } })
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
