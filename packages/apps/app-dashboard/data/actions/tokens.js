class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  getAssets ({ currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ASSETS', payload: { currentAddress } })
  }

  getERC721Assets ({ currentAddress, page }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_ASSETS', payload: { currentAddress, page } })
  }

  getTokenERC20Data ({ tokenAddress, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC20_DATA', payload: { tokenAddress, chainId } })
  }

  getTokenERC721Data ({ tokenAddress, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_DATA', payload: { tokenAddress, chainId } })
  }

  getEthData () {
    this.actions.dispatch({ type: '*TOKENS.GET_ETH_DATA' })
  }

  getEthBalance ({ account, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ETH_BALANCE', payload: { account, chainId } })
  }

  getERC20Balance ({ chainId, tokenAddress, account, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC20_BALANCE', payload: { chainId, tokenAddress, account, currentAddress } })
  }

  getERC721Approved ({ chainId, tokenAddress, account, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GET_ERC721_APPROVED', payload: { chainId, tokenAddress, account, currentAddress } })
  }

  generateERC20Link ({ chainId, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ERC20_LINK', payload: { chainId, currentAddress } })
  }

  generateERC721Link ({ tokenId }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ERC721_LINK', payload: { tokenId } })
  }

  generateETHLink ({ chainId, currentAddress }) {
    this.actions.dispatch({ type: '*TOKENS.GENERATE_ETH_LINK', payload: { chainId, currentAddress } })
  }

  setTokenERC20Data ({ tokenSymbol }) {
    this.actions.dispatch({ type: '*TOKENS.SET_ERC20_DATA', payload: { tokenSymbol } })
  }

  setTokenERC721Data ({ address }) {
    this.actions.dispatch({ type: '*TOKENS.SET_ERC721_DATA', payload: { address } })
  }

  emptyTokenERC20Data () {
    this.actions.dispatch({ type: '*TOKENS.EMPTY_ERC20_DATA' })
  }
}

export default Tokens
