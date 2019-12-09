import { put, select } from 'redux-saga/effects'
import { initializeSdk } from 'data/sdk'
import { defineNetworkName, defineJsonRpcUrl, getHashVariables } from '@linkdrop/commons'
import Linkdrop from '@linkdrop/contracts/build/Linkdrop.json'
import {
  jsonRpcUrlXdai,
  infuraPk,
  factory,
  defaultChainId,
  claimHost
} from 'config'
import { ethers } from 'ethers'

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
      yield put({ type: 'USER.SET_SDK', payload: { sdk } })
      const link = yield select(generator.selectors.link)
      if (link) {
        const {
          linkKey,
          linkdropContract
        } = getHashVariables({ url: link })
        const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
        const linkWallet = yield new ethers.Wallet(linkKey, provider)
        const linkId = yield linkWallet.address
        const linkdropContractInstance = yield new ethers.Contract(linkdropContract, Linkdrop.abi, provider)
        try {
          const claimed = yield linkdropContractInstance.isClaimedLink(linkId)
          console.log({ claimed })
          if (claimed) {
            yield put({ type: 'LINK.SET_LINK', payload: { link: null } })
            yield put({ type: 'LINK.SET_MINIFIED_LINK', payload: { minifiedLink: null } })
            yield put({
              type: 'ASSETS.SET_ETH_BALANCE',
              payload: {
                ethBalance: null,
                ethBalanceFormatted: null
              }
            })
            yield put({ type: 'LINK.SET_PAGE', payload: { page: 'process' } })
          } else {
            window.location = '/#/link-generate'
          }
        } catch (e) {
          window.location = '/#/link-generate'
        }
      }
      
      yield put({ type: 'USER.SET_PROXY_ADDRESS', payload: { proxyAddress } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  wallet: ({ user: { wallet } }) => wallet,
  privateKey: ({ user: { privateKey } }) => privateKey,
  link: ({ link: { link } }) => link
}
