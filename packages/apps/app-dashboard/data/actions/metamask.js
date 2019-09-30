class Metamask {
  constructor (actions) {
    this.actions = actions
  }

  sendEth ({ chainId, ethAmount, account }) {
    this.actions.dispatch({ type: '*METAMASK.SEND_ETH', payload: { ethAmount, account, chainId } })
  }

  sendErc20 ({ tokenAmount, account }) {
    this.actions.dispatch({ type: '*METAMASK.SEND_ERC20', payload: { account, tokenAmount } })
  }

  sendErc721 ({ tokenAmount, account }) {
    this.actions.dispatch({ type: '*METAMASK.SEND_ERC721', payload: { account, tokenAmount } })
  }
}

export default Metamask
