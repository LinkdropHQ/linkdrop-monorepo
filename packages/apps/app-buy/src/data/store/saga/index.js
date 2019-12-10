import link from './link'
import user from './user'
import assets from './assets'
import deeplinks from './deeplinks'

function * saga () {
  yield * link()
  yield * user()
  yield * assets()
  yield * deeplinks()
}

export default saga
