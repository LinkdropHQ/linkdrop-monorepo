import { select } from 'redux-saga/effects'

const generator = function * () {
  try {
    const started = yield select(generator.selectors.started)
    const communication = yield select(generator.selectors.communication)
    if (started) {
      communication.hideWidget()
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  started: ({ widget: { started } }) => started,
  communication: ({ widget: { communication } }) => communication
}
