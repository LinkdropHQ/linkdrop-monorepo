import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { jsonRpcUrl } from 'app.config.js'
const ls = (typeof window === 'undefined' ? {} : window).localStorage

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const campaigns = yield select(generator.selectors.campaigns)
    const { txHash, id: proxyAddress } = payload
    const provider = yield new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const receipt = yield provider.getTransactionReceipt(txHash)
    if (receipt && receipt.status === 0) {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    if (receipt && receipt.status === 1 && receipt.confirmations != null && receipt.confirmations > 0) {
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      const campaignsUpdated = campaigns.map(campaign => {
        if (campaign.id === proxyAddress) {
          campaign.status = campaign.awaitingStatus
          campaign.loading = false
          campaign.awaitingStatus = null
          campaign.awaitingTxHash = null
        }
        return campaign
      })
      const campaignsStringified = JSON.stringify(campaignsUpdated)
      ls && ls.setItem && ls.setItem('campaigns', window.btoa(campaignsStringified))
      yield put({ type: 'CAMPAIGNS.SET_ITEMS', payload: { items: campaignsUpdated } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  privateKey: ({ user: { privateKey } }) => privateKey,
  campaigns: ({ campaigns: { items: campaigns } }) => campaigns
}
