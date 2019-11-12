import link from './link'
import user from './user'

function * saga () {
  yield * link()
  yield * user()
}

export default saga
