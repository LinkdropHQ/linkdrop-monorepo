class User {
  constructor (actions) {
    this.actions = actions
  }

  changeLocale ({ locale }) {
    this.actions.dispatch({ type: 'USER.CHANGE_LOCALE', payload: { locale } })
  }

  setStep ({ step }) {
    this.actions.dispatch({ type: 'USER.SET_STEP', payload: { step } })
  }

  setLoading ({ loading }) {
    this.actions.dispatch({ type: 'USER.SET_LOADING', payload: { loading } })
  }

  setErrors ({ errors }) {
    this.actions.dispatch({ type: 'USER.SET_ERRORS', payload: { errors } })
  }

  createSdk ({ chainId }) {
    this.actions.dispatch({ type: '*USER.CREATE_SDK', payload: { chainId } })
  }

  setUserData ({ privateKey, contractAddress, ens }) {
    this.actions.dispatch({ type: '*USER.SET_USER_DATA', payload: { privateKey, contractAddress, ens } })
  }

  createWallet () {
    this.actions.dispatch({ type: '*USER.CREATE_WALLET' })
  }
}

export default User
