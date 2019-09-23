import tokens from './tokens'
import assets from './assets'
import user from './user'
import widget from './widget'

function * saga () {
  yield * tokens()
  yield * assets()
  yield * user()
  yield * widget()
}

export default saga
