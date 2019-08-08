import tokens from './tokens'
import assets from './assets'
import user from './user'

function * saga () {
  yield * tokens()
  yield * assets()
  yield * user()
}

export default saga
