class User {
  constructor (actions) {
    this.actions = actions
  }

  setLocale ({ locale }) {
    this.actions.dispatch({ type: 'USER.SET_LOCALE', payload: { locale } })
  }
}

export default User
