class Contract {
  constructor (actions) {
    this.actions = actions
  }

  getTokenERC20Data ({ tokenAddress, tokenAmount, weiAmount, chainId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_ERC20_DATA', payload: { tokenAddress, tokenAmount, weiAmount, chainId } })
  }

  getTokenERC721Data ({ nftAddress, tokenId, chainId, name }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_ERC721_DATA', payload: { nftAddress, tokenId, chainId, name } })
  }

  getPastEvents ({ linkKey, chainId, campaignId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_PAST_EVENTS', payload: { linkKey, chainId, campaignId } })
  }
}

export default Contract
