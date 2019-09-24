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

  setUserData ({ privateKey, contractAddress, ens, avatar, chainId }) {
    this.actions.dispatch({ type: '*USER.SET_USER_DATA', payload: { privateKey, contractAddress, ens, avatar, chainId } })
  }

  createWallet () {
    this.actions.dispatch({ type: '*USER.CREATE_WALLET' })
  }

  toggleNote ({ showNote }) {
    this.actions.dispatch({ type: 'USER.TOGGLE_NOTE', payload: { showNote } })
  }

  setChainId ({ chainId }) {
    this.actions.dispatch({ type: 'USER.SET_CHAIN_ID', payload: { chainId } })
  }
}

export default User
