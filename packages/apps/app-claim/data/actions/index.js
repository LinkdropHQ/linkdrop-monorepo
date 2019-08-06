import User from './user'
import Routing from './routing'
import Tokens from './tokens'
import ContractsData from './contracts-data'

class Actions {
  constructor (env) {
    this.dispatch = (env.props || env).dispatch
    this.history = (env.props || env).history

    this.routing = new Routing(this)
    this.user = new User(this)
    this.tokens = new Tokens(this)
    this.contractsData = new ContractsData(this)
  }
}

export default Actions
