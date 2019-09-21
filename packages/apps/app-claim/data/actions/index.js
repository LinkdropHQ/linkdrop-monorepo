import User from './user'
import Routing from './routing'
import Tokens from './tokens'
import Assets from './assets'
import Contracts from './contracts'
import Contacts from './contacts'
import Widget from './widget'

class Actions {
  constructor (env) {
    this.dispatch = (env.props || env).dispatch
    this.history = (env.props || env).history

    this.routing = new Routing(this)
    this.user = new User(this)
    this.tokens = new Tokens(this)
    this.assets = new Assets(this)
    this.contracts = new Contracts(this)
    this.contacts = new Contacts(this)
    this.widget = new Widget(this)
  }
}

export default Actions
