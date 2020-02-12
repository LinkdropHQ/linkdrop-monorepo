import user from './user'

function * saga () {
  yield * user()
}

export default saga
