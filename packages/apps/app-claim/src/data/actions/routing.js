class Routing {
  constructor (actions) {
    this.actions = actions
  }

  goTo (href) {
    this.actions.history.push(href, {})
  }
}

export default Routing
