class Link {
  constructor (actions) {
    this.actions = actions
  }

  createLink () {
    this.actions.dispatch({ type: '*LINK.CREATE_LINK' })
  }
}

export default Link
