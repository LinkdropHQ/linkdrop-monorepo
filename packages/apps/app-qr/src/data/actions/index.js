import User from './user'

class Actions {
  constructor (env) {
    this.dispatch = (env.props || env).dispatch
    this.history = (env.props || env).history

    this.user = new User(this)
  }
}

export default Actions
