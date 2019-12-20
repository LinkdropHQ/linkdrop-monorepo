import { put, select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { linkId, contract, initialBlock, provider } = payload
    const eventPromise = new Promise((resolve, reject) => {
      contract.getPastEvents(
        'Claimed',
        {
          filter: { linkId },
          fromBlock: initialBlock,
          toBlock: 'latest'
        },
        (err, events) => {
          if (err) { console.error(err); return reject(err) }
          return resolve({ events })
        })
    })
    const { events } = yield eventPromise
    if (events && events[0] && events[0].transactionHash) {
      const promise = new Promise((resolve, reject) => {
        provider.getTransactionReceipt(events[0].transactionHash)
        .then(receipt => {
          resolve(receipt)
        })
        .catch(err => reject(err))
      })
      const receipt = yield promise
      yield put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: Number(receipt.status) === 1 ? 'claimed' : 'failed' } })
      return yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: events[0].transactionHash } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
