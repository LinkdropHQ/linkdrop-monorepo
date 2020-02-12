class User {
  constructor (actions) {
    this.actions = actions
  }

  checkPassword ({ password }) {
    this.actions.dispatch({ type: '*USER.CHECK_PASSWORD', payload: { password } })
  }

  generateLink () {
    this.actions.dispatch({ type: '*USER.GENERATE_LINK' })
  }
}

export default User
