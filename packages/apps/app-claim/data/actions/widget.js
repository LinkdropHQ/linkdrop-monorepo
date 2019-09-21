class Widget {
  constructor (actions) {
    this.actions = actions
  }

  setPage ({ page }) {
    this.actions.dispatch({ type: 'WIDGET.SET_PAGE', payload: { page } })
  }

  setConnected ({ connected }) {
    this.actions.dispatch({ type: 'WIDGET.SET_CONNECTED', payload: { connected } })
  }

  setTxParams ({ txParams }) {
    this.actions.dispatch({ type: 'WIDGET.SET_TX_PARAMS', payload: { txParams } })
  }

  confirmTx () {
    this.actions.dispatch({ type: '*WIDGET.CONFIRM_TX' })
  }

  connectToDapp ({ methods }) {
    this.actions.dispatch({ type: '*WIDGET.CONNECT_TO_DAPP', payload: { methods } })
  }

  show () {
    this.actions.dispatch({ type: '*WIDGET.SHOW' })
  }

  hide () {
    this.actions.dispatch({ type: '*WIDGET.HIDE' })
  }

  close () {
    this.actions.dispatch({ type: '*WIDGET.CLOSE' })
  }

  confirm ({ payload = {} }) {
    this.actions.dispatch({ type: '*WIDGET.CONFIRM', payload })
  }
}

export default Widget
