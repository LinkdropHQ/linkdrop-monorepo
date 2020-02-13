class Deeplinks {
  constructor (actions) {
    this.actions = actions
  }

  getCoinbaseLink ({ chainId }) {
    this.actions.dispatch({
      type: '*DEEPLINKS.GET_COINBASE_LINK',
      payload: {
        chainId
      }
    })
  }
}

export default Deeplinks
