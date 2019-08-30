class Assets {
  constructor (actions) {
    this.actions = actions
  }

  getTokenERC20Data ({ tokenAddress, tokenAmount, weiAmount, chainId }) {
    this.actions.dispatch({ type: '*ASSETS.GET_TOKEN_ERC20_DATA', payload: { tokenAddress, tokenAmount, weiAmount, chainId } })
  }

  getEthData ({ weiAmount, chainId }) {
    this.actions.dispatch({ type: '*ASSETS.GET_ETH_DATA', payload: { weiAmount, chainId } })
  }

  getTokenERC721Data ({ nftAddress, tokenId, chainId }) {
    this.actions.dispatch({ type: '*ASSETS.GET_TOKEN_ERC721_DATA', payload: { nftAddress, tokenId, chainId } })
  }

  getPastEvents ({ linkKey, chainId, campaignId }) {
    this.actions.dispatch({ type: '*ASSETS.GET_PAST_EVENTS', payload: { linkKey, chainId, campaignId } })
  }

  saveClaimedAssets () {
    this.actions.dispatch({ type: '*ASSETS.SAVE_CLAIMED_ASSETS' })
  }

  getItems ({ wallet, chainId }) {
    this.actions.dispatch({ type: '*ASSETS.GET_ITEMS', payload: { wallet, chainId } })
  }

  sendErc20 ({ to, amount, chainId, tokenAddress, decimals }) {
    this.actions.dispatch({ type: '*ASSETS.SEND_ERC20', payload: { to, amount, tokenAddress, decimals, chainId } })
  }

  sendEth ({ to, amount, chainId }) {
    this.actions.dispatch({ type: '*ASSETS.SEND_ETH', payload: { to, amount, chainId } })
  }
}

export default Assets
