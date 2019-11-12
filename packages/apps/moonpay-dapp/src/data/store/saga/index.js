import link from './link'

function * saga () {
  yield * link()
}

export default saga
