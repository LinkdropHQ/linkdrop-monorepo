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

  createInitialData () {
    this.actions.dispatch({ type: '*USER.CREATE_INITIAL_DATA' })
  }
}

export default User
