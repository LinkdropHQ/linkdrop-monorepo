import tokens from './tokens'
import contract from './contract'
import user from './user'
import deeplinks from './deeplinks'

function * saga () {
  yield * tokens()
  yield * contract()
  yield * user()
  yield * deeplinks()
}

export default saga
