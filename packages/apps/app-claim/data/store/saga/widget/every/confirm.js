import { select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const { txHash, success, errors } = payload
    const eventEmitter = yield select(generator.selectors.eventEmitter)
    eventEmitter.emit('userAction', { action: 'confirm', payload: { txHash, success, errors } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  eventEmitter: ({ widget: { eventEmitter } }) => eventEmitter
}
