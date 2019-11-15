import link from './link'
import user from './user'
import assets from './assets'

function * saga () {
  yield * link()
  yield * user()
  yield * assets()
}

export default saga
