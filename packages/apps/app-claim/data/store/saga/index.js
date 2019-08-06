import tokens from './tokens'
import contractsData from './contracts-data'
import user from './user'

function * saga () {
  yield * tokens()
  yield * contractsData()
  yield * user()
}

export default saga
