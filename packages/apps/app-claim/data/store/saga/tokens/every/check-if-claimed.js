import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { jsonRpcUrlXdai, infuraPk } from 'app.config.js'
import Linkdrop from '@linkdrop/contracts/build/Linkdrop.json'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { linkKey, chainId, linkdropContract } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const linkWallet = yield new ethers.Wallet(linkKey, provider)
    const linkId = yield linkWallet.address
    const linkdropContractInstance = yield new ethers.Contract(linkdropContract, Linkdrop.abi, provider)
    const claimed = yield linkdropContractInstance.isClaimedLink(linkId)
    yield put({ type: 'USER.SET_ALREADY_CLAIMED', payload: { alreadyClaimed: claimed } })
    yield put({ type: 'USER.SET_READY_TO_CLAIM', payload: { readyToClaim: true } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ALREADY_CLAIMED', payload: { alreadyClaimed: false } })
    yield put({ type: 'USER.SET_READY_TO_CLAIM', payload: { readyToClaim: true } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
