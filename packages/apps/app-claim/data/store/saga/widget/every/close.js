import { select } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    const eventEmitter = yield select(generator.selectors.eventEmitter)
    eventEmitter.emit('userAction', { action: 'cancel', payload: null })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  eventEmitter: ({ widget: { eventEmitter } }) => eventEmitter
}
