class User {
  constructor (actions) {
    this.actions = actions
  }

  generateLink ({ password, email }) {
    this.actions.dispatch({ type: '*USER.GENERATE_LINK', payload: { password, email } })
  }

  setError ({ error }) {
  	this.actions.dispatch({ type: 'USER.SET_ERROR', payload: { error } })
  }
}

export default User
