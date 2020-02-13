class User {
  constructor (actions) {
    this.actions = actions
  }

  generateLink ({ email }) {
    this.actions.dispatch({ type: '*USER.GENERATE_LINK', payload: { email } })
  }

  setError ({ error }) {
  	this.actions.dispatch({ type: 'USER.SET_ERROR', payload: { error } })
  }

  checkPassword ({ email }) {
  	this.actions.dispatch({ type: '*USER.CHECK_PASSWORD', payload: { email } })
  }

  setNewPassword ({ password, email }) {
  	this.actions.dispatch({ type: '*USER.SET_NEW_PASSWORD', payload: { password, email } })
  }
}

export default User
