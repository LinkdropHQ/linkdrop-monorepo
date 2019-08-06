class ContractsData {
  constructor (actions) {
    this.actions = actions
  }

  getTokenERC20Data ({ tokenAddress, tokenAmount, weiAmount, chainId }) {
    this.actions.dispatch({ type: '*CONTRACTS_DATA.GET_TOKEN_ERC20_DATA', payload: { tokenAddress, tokenAmount, weiAmount, chainId } })
  }

  getETHData ({ weiAmount }) {
    this.actions.dispatch({ type: '*CONTRACTS_DATA.GET_TOKEN_ERC20_DATA', payload: { weiAmount } })
  }

  getTokenERC721Data ({ nftAddress, tokenId, chainId }) {
    this.actions.dispatch({ type: '*CONTRACTS_DATA.GET_TOKEN_ERC721_DATA', payload: { nftAddress, tokenId, chainId } })
  }

  getPastEvents ({ linkKey, chainId, campaignId }) {
    this.actions.dispatch({ type: '*CONTRACTS_DATA.GET_PAST_EVENTS', payload: { linkKey, chainId, campaignId } })
  }
}

export default ContractsData
