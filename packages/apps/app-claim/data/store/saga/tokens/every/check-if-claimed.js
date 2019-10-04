import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { factory, jsonRpcUrlXdai, infuraPk } from 'app.config.js'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { linkdropMasterAddress, linkKey, campaignId, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
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
