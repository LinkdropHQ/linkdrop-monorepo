class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claimTokensERC20 ({ campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC20', payload: { campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } })
  }

  claimTokensERC721 ({ wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature }) {
    this.actions.dispatch({ type: '*TOKENS.CLAIM_TOKENS_ERC721', payload: { wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature } })
  }

  checkTransactionStatus ({ transactionId, chainId, statusToAdd }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, chainId, statusToAdd } })
  }

  checkIfClaimed ({ linkKey, chainId, linkdropMasterAddress, campaignId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, chainId, linkdropMasterAddress, campaignId } })
  }

  setTransactionId ({ transactionId }) {
    this.actions.dispatch({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId } })
  }

  setTransactionStatus ({ transactionStatus }) {
    this.actions.dispatch({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus } })
  }

  setTransactionData ({ transactionData }) {
    this.actions.dispatch({ type: 'TOKENS.SET_TRANSACTION_DATA', payload: { transactionData } })
  }
}

export default Tokens
