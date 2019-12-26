import { put, select } from 'redux-saga/effects'
const ls = (typeof window === 'undefined' ? {} : window).localStorage
import { linksLimit } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const { links } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    yield put({ type: 'USER.SET_STEP', payload: { step: links.length < linksLimit ? 5 : 6 } })
    const chainId = yield select(generator.selectors.chainId)
    const currentAddress = yield select(generator.selectors.currentAddress)
    const privateKey = yield select(generator.selectors.privateKey)
    const tokenAddress = yield select(generator.selectors.tokenAddress)
    const tokenDecimals = yield select(generator.selectors.tokenDecimals)
    const {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      id,
      linksAmount,
      tokenType,
      date,
      proxyAddress,
      defaultWallet
    } = yield select(generator.selectors.campaignData)

    const newCampaign = {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      defaultWallet,
      status: 'active',
      linksAmount,
      tokenType,
      created: date,
      links,
      chainId,
      id: proxyAddress,
      campaignId: id,
      proxyAddress,
      currentAddress,
      privateKey,
      tokenAddress,
      tokenDecimals
    }
    console.log({ newCampaign })
    const campaigns = yield select(generator.selectors.campaigns)
    const campaignsUpdated = campaigns.concat(newCampaign)
    yield put({ type: 'CAMPAIGNS.SET_ITEMS', payload: { items: campaignsUpdated } })
    const campaignsStringified = JSON.stringify(campaignsUpdated)
    ls && ls.setItem && ls.setItem('campaigns', window.btoa(campaignsStringified))
    yield put({ type: '*CAMPAIGNS.RESET_DATA' })
    yield put({ type: 'CAMPAIGNS.SET_CURRENT', payload: { current: proxyAddress } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  currentAddress: ({ user: { currentAddress } }) => currentAddress,
  privateKey: ({ user: { privateKey } }) => privateKey,
  campaigns: ({ campaigns: { items: campaigns } }) => campaigns,
  chainId: ({ user: { chainId } }) => chainId,
  tokenAddress: ({ tokens: { address } }) => address,
  tokenDecimals: ({ tokens: { decimals } }) => decimals,
  campaignData: ({
    campaigns: {
      tokenAmount,
      tokenSymbol,
      ethAmount,
      linksAmount,
      tokenType,
      date,
      id,
      defaultWallet,
      proxyAddress
    }
  }) => ({
    tokenAmount,
    tokenSymbol,
    ethAmount,
    linksAmount,
    tokenType,
    defaultWallet,
    date,
    id,
    proxyAddress
  })
}
