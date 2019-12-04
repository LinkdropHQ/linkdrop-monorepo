import { put, select, call } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { BitlyClient } from 'bitly'
const bitly = new BitlyClient('2738450834b87776fed4f9331018aeb760089928', {})
import { register } from 'data/api/sender'
import {
  defaultChainId,
  factory
} from 'config'
import { defineNetworkName } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const networkName = defineNetworkName({ chainId: defaultChainId })
    const ethBalance = yield select(generator.selectors.ethBalance)
    const privateKey = yield select(generator.selectors.privateKey)
    const wallet = yield select(generator.selectors.wallet)
    const sdk = yield select(generator.selectors.sdk)
    yield put({ type: 'LINK.SET_LOADING', payload: { loading: true } })
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const { success } = yield call(register, { factoryAddress: factory, senderAddress: wallet, apiHost: `https://${networkName}-v2.linkdrop.io` })
    if (success) {
      const { url } = yield sdk.generateLink({
        campaignId: 0, // 0
        token: ethersContractZeroAddress,
        nativeTokensAmount: String(ethBalance), // atomic value
        signingKeyOrWallet: privateKey // private key of wallet
      })
      let finalLink = url
      if (finalLink.indexOf('localhost') === -1) {
        const shortenUrl = yield bitly.shorten(finalLink)
        finalLink = shortenUrl.url
      }

      yield put({ type: 'LINK.SET_LINK', payload: { link: url } })
      yield put({ type: 'LINK.SET_MINIFIED_LINK', payload: { minifiedLink: finalLink } })
      yield put({ type: 'LINK.SET_PAGE', payload: { page: 'finished' } })
    } else {
      window.alert('Some error occured')
    }
    
    yield put({ type: 'LINK.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  ethBalance: ({ assets: { ethBalance } }) => ethBalance,
  sdk: ({ user: { sdk } }) => sdk,
  wallet: ({ user: { wallet } }) => wallet,
  privateKey: ({ user: { privateKey } }) => privateKey
}
