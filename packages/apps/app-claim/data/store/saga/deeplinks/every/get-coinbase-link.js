import { call } from 'redux-saga/effects'
import { getCoinbaseLinks } from 'data/api/deep-links'
import { defineNetworkName } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const { chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const currentUrl = window.location.href
    const { success, link: coinbaseDeepLink } = yield call(getCoinbaseLinks, { networkName, url: currentUrl })
    if (success) { return coinbaseDeepLink }
  } catch (e) {
    console.error(e)
  }
}

export default generator
