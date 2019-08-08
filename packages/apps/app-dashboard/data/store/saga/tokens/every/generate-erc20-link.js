import { put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { utils } from 'ethers'
import configs from 'config-dashboard'
import { convertFromExponents } from '@linkdrop/commons'
import getCoinbaseWalletDeepLink from 'data/api/coinbase/get-deep-link'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const erc20Balance = yield select(generator.selectors.tokenAmount)
    const ethBalance = yield select(generator.selectors.ethAmount)
    const weiAmount = utils.parseEther(convertFromExponents(ethBalance || 0))
    const decimals = yield select(generator.selectors.decimals)
    const sdk = yield select(generator.selectors.sdk)
    const campaignId = yield select(generator.selectors.campaignId)
    const erc20BalanceFormatted = utils.parseUnits(
      String(erc20Balance),
      decimals
    )
    const privateKey = yield select(generator.selectors.privateKey)
    const tokenAddress = yield select(generator.selectors.tokenAddress)

    const link = yield sdk.generateLink({
      signingKeyOrWallet: privateKey,
      weiAmount: weiAmount || 0,
      tokenAddress,
      tokenAmount: String(erc20BalanceFormatted),
      expirationTime: configs.expirationTime,
      campaignId
    })

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
  tokenAmount: ({ campaigns: { tokenAmount } }) => tokenAmount,
  ethAmount: ({ campaigns: { ethAmount } }) => ethAmount,
  privateKey: ({ user: { privateKey } }) => privateKey,
  links: ({ campaigns: { links } }) => links,
  decimals: ({ tokens: { decimals } }) => decimals,
  version: ({ user: { version } }) => version,
  tokenAddress: ({ tokens: { address } }) => address,
  sdk: ({ user: { sdk } }) => sdk,
  campaignId: ({ campaigns: { id } }) => id
}
