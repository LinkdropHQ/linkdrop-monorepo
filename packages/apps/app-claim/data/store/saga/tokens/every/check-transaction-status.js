import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const chainId = yield select(generator.selectors.chainId)
    const { transactionId, statusToAdd } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const receipt = yield provider.getTransactionReceipt(transactionId)
    if (receipt && receipt.status === 0) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'failed' } })
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: null } })
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    if (receipt && receipt.confirmations != null && receipt.confirmations > 0) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: null } })
      yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: statusToAdd } })
      const transactionData = yield select(generator.selectors.transactionData)
      yield put({
        type: 'TOKENS.SET_TRANSACTION_DATA',
        payload: {
          transactionData: { ...transactionData, status: 'finished' }
        }
      })
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  transactionData: ({ tokens: { transactionData } }) => transactionData,
  chainId: ({ user: { chainId } }) => chainId
}
