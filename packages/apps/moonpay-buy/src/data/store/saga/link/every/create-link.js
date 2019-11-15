import { put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const ethBalance = yield select(generator.selectors.ethBalance)
    const privateKey = yield select(generator.selectors.privateKey)
    const sdk = yield select(generator.selectors.sdk)
    yield put({ type: 'LINK.SET_LOADING', payload: { loading: true } })
    const ethersContractZeroAddress = ethers.constants.AddressZero
    const link = sdk.generateLink({
      campaignId: 0, // 0
      tokenAddress: ethersContractZeroAddress,
      nativeTokensAmount: ethBalance, // atomic value
      signingKeyOrWallet: privateKey // private key of wallet
    })
    console.log({ link })
    yield put({ type: 'LINK.SET_LINK', payload: { link: 'https://linkdrop.io' } })
    yield put({ type: 'LINK.SET_PAGE', payload: { page: 'finished' } })
    yield put({ type: 'LINK.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  ethBalance: ({ assets: { ethBalance } }) => ethBalance,
  sdk: ({ user: { sdk } }) => sdk,
  privateKey: ({ user: { privateKey } }) => privateKey
}
