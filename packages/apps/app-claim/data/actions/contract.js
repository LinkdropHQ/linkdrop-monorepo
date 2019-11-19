class Contract {
  constructor (actions) {
    this.actions = actions
  }

  getTokenERC20Data ({ token, nativeTokensAmount, tokensAmount, chainId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_ERC20_DATA', payload: { token, nativeTokensAmount, tokensAmount, chainId } })
  }

  getTokenERC721Data ({ nft, tokenId, chainId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_TOKEN_ERC721_DATA', payload: { nft, tokenId, chainId } })
  }

  getPastEvents ({ linkKey, chainId, campaignId }) {
    this.actions.dispatch({ type: '*CONTRACT.GET_PAST_EVENTS', payload: { linkKey, chainId, campaignId } })
  }
}

export default Contract
