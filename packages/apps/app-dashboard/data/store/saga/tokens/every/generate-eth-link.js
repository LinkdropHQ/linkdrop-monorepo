import { put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { ethers, utils } from 'ethers'
import configs from 'config-dashboard'
import { convertFromExponents } from '@linkdrop/commons'
import getCoinbaseWalletDeepLink from 'data/api/coinbase/get-deep-link'

const generator = function * ({ payload }) {
  try {
    const sdk = yield select(generator.selectors.sdk)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const balance = yield select(generator.selectors.ethAmount)
    const weiAmount = utils.parseEther(convertFromExponents(balance))
    const privateKey = yield select(generator.selectors.privateKey)
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const campaignId = yield select(generator.selectors.campaignId)
    const link = yield sdk.generateLink({
      signingKeyOrWallet: privateKey,
      weiAmount,
      tokenAddress: ethersContractZeroAddress,
      tokenAmount: 0,
      expirationTime: configs.expirationTime,
      campaignId
    })

    // coinbase link logic
    console.log('fetching coinbase link', { link })
    try { 
      const { success, link: coinbaseDeepLink } = yield getCoinbaseWalletDeepLink({ url: link.url })
      console.log('got coinbase link', coinbaseDeepLink)
      if (success) { 
        link.url = coinbaseDeepLink
      }
    } catch (err) {
      console.log('Error while converting url to coinbase deep link')
      console.log(err)
    }
      
    
    yield delay(10)
    const links = yield select(generator.selectors.links)
    const linksUpdated = links.concat(link.url)
    yield put({ type: 'CAMPAIGNS.SET_LINKS', payload: { links: linksUpdated } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  ethAmount: ({ campaigns: { ethAmount } }) => ethAmount,
  privateKey: ({ user: { privateKey } }) => privateKey,
  links: ({ campaigns: { links } }) => links,
  version: ({ user: { version } }) => version,
  tokenType: ({ tokens: { tokenType } }) => tokenType,
  sdk: ({ user: { sdk } }) => sdk,
  campaignId: ({ campaigns: { id } }) => id
}
