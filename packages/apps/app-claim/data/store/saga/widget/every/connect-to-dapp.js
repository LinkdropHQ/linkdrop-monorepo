import { select, put } from 'redux-saga/effects'
import connectToParent from 'penpal/lib/connectToParent'

const generator = function * ({ payload }) {
  try {
    const { methods } = payload
    const started = yield select(generator.selectors.started)
    if (!started) {
      const connection = connectToParent({
        // Methods child is exposing to parent
        // temp hack: receiving methods from React app
        methods
      })

      const communication = yield connection.promise
      yield put({ type: 'WIDGET.SET_COMMUNICATION', payload: { communication } })
      yield put({ type: 'WIDGET.SET_STARTED', payload: { started: true } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  started: ({ widget: { started } }) => started
}
