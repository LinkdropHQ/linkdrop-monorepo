import User from './user'
import Link from './link'
import Assets from './assets'
import Deeplinks from './deeplinks'

class Actions {
  constructor (env) {
    this.dispatch = (env.props || env).dispatch
    this.history = (env.props || env).history
    this.link = new Link(this)
    this.user = new User(this)
    this.assets = new Assets(this)
    this.deeplinks = new Deeplinks(this)
  }
}

export default Actions
