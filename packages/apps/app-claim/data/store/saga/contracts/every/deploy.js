import { select } from 'redux-saga/effects'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const ens = yield select(generator.selectors.ens)
    const sdk = yield select(generator.selectors.sdk)
    const walletContractExist = yield sdk.walletContractExist(ens)
    console.log(walletContractExist)
    if (!walletContractExist) {
      const gasPrice = String(ethers.utils.parseUnits('5', 'gwei'))
      const privateKey = yield select(generator.selectors.privateKey)
      console.log({ privateKey, ens, gasPrice })
      const result = yield sdk.deploy(privateKey, ens, gasPrice)
      console.log({ result })
      // yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
      // const { linkdropMasterAddress, linkKey, chainId, campaignId } = payload
      // const networkName = defineNetworkName({ chainId })
      // const provider = yield ethers.getDefaultProvider(networkName)
      // const linkWallet = yield new ethers.Wallet(linkKey, provider)
      // const linkId = yield linkWallet.address
      // const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
      // const claimed = yield factoryContract.isClaimedLink(linkdropMasterAddress, campaignId, linkId)
      // yield put({ type: 'USER.SET_ALREADY_CLAIMED', payload: { alreadyClaimed: claimed } })
      // yield put({ type: 'USER.SET_READY_TO_CLAIM', payload: { readyToClaim: true } })
      // yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  ens: ({ user: { ens } }) => ens,
  privateKey: ({ user: { privateKey } }) => privateKey,
  sdk: ({ user: { sdk } }) => sdk
}
