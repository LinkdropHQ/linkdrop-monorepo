class Assets {
  constructor (actions) {
    this.actions = actions
  }

  checkBalance () {
    this.actions.dispatch({ type: '*ASSETS.CHECK_BALANCE' })
  }
}

export default Assets
