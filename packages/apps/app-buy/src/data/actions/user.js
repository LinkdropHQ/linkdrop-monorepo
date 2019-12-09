class User {
  constructor (actions) {
    this.actions = actions
  }

  setLocale ({ locale }) {
    this.actions.dispatch({ type: 'USER.SET_LOCALE', payload: { locale } })
  }

  createSdk ({ locale }) {
    this.actions.dispatch({ type: '*USER.CREATE_SDK' })
  }

  createInitialData ({ application }) {
    this.actions.dispatch({ type: '*USER.CREATE_INITIAL_DATA', payload: { application } })
  }

  clearData () {
    this.actions.dispatch({ type: '*USER.CLEAR_DATA' })
  }
}

export default User
