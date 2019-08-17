class Contracts {
  constructor (actions) {
    this.actions = actions
  }

  deploy () {
    this.actions.dispatch({ type: '*CONTRACTS.DEPLOY' })
  }
}

export default Contracts
