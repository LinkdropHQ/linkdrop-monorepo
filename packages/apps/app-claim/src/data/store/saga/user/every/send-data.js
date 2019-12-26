import { put, call, select } from 'redux-saga/effects'
import { sendData } from 'data/api/user'
import { defineNetworkName, getHashVariables } from '@linkdrop/commons'
import { delay } from 'redux-saga'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { email, address } = payload
    const { chainId: linkChainId } = getHashVariables()
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId: chainId || linkChainId })
    yield delay(2000)
    const { success } = yield call(sendData, { email, address: ethers.constants.AddressZero, networkName })
    yield put({ type: 'USER.SET_SEND_DATA_STATUS', payload: { sendDataStatus: success ? 'success' : 'failed' } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}