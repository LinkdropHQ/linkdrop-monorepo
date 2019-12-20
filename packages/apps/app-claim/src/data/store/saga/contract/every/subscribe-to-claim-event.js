import { put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { linkId, contract, provider } = payload
    const eventPromise = new Promise((resolve, reject) => {
      const filter = contract.filters.Claimed(linkId)
      contract.on(filter, (linkId, ethAmount, token, tokenAmount, receiver, event) => {
        return resolve({ event })
      })
    })
    const { event } = yield eventPromise
    if (event && event.transactionHash) {
      const promise = new Promise((resolve, reject) => {
        provider.getTransactionReceipt(event.transactionHash)
        .then(receipt => {
          resolve(receipt)
        })
        .catch(err => reject(err))
      })
      const receipt = yield promise
      yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: Number(receipt.status) === 1 ? 'claimed' : 'failed' } })
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: event.transactionHash } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
