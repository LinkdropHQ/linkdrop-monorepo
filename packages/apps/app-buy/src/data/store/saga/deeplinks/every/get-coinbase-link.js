import { call, put } from 'redux-saga/effects'
import { getCoinbaseLinks } from 'data/api/deep-links'
import { defineNetworkName } from '@linkdrop/commons'
import {
  defaultChainId
} from 'config'

const generator = function * ({ payload }) {
  try {
    const { url } = payload
    const networkName = defineNetworkName({ chainId: defaultChainId })
    const { success, link: coinbaseDeepLink } = yield call(getCoinbaseLinks, { networkName, url })
    if (success) {
	    if (coinbaseDeepLink) {
	      yield put({ type: 'DEEPLINKS.SET_COINBASE_LINK', payload: { coinbaseLink: coinbaseDeepLink } })
	    }
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
