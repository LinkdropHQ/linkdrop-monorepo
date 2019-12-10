class Deeplinks {
  constructor (actions) {
    this.actions = actions
  }

  getCoinbaseLink ({ url }) {
    this.actions.dispatch({ type: '*DEEPLINKS.GET_COINBASE_LINK', payload: { url } })
  }
}

export default Deeplinks
