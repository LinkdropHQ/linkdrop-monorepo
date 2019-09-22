import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { factory } from 'app.config.js'
import { defineNetworkName } from '@linkdrop/commons'
import LinkdropFactory from 'contracts/LinkdropFactory.json'

const generator = function * ({ payload }) {
  try {
    const chainId = yield select(generator.selectors.chainId)
    yield put({ type: 'USER.SET_READY_TO_CLAIM', payload: { readyToClaim: false } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { linkdropMasterAddress, linkKey, campaignId } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const linkWallet = yield new ethers.Wallet(linkKey, provider)
    const linkId = yield linkWallet.address
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const claimed = yield factoryContract.isClaimedLink(linkdropMasterAddress, campaignId, linkId)
    yield put({ type: 'USER.SET_ALREADY_CLAIMED', payload: { alreadyClaimed: claimed } })
    yield put({ type: 'USER.SET_READY_TO_CLAIM', payload: { readyToClaim: true } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}
