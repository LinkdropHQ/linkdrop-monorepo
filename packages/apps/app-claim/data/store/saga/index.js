import tokens from './tokens'
import assets from './assets'
import user from './user'
import contracts from './contracts'

function * saga () {
  yield * tokens()
  yield * assets()
  yield * user()
  yield * contracts()
}

export default saga
