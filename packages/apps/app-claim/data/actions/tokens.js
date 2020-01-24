class Tokens {
  constructor (actions) {
    this.actions = actions
  }

  claim ({
    token,
    campaignId,
    feeToken,
    feeReceiver,
    linkKey,
    nativeTokensAmount,
    tokensAmount,
    feeAmount,
    expiration,
    signerSignature,
    receiverAddress,
    linkdropContract,
    sender,
    nft,
    tokenId
  }) {
    this.actions.dispatch({
      type: '*TOKENS.CLAIM',
      payload: {
        token,
        feeToken,
        feeReceiver,
        linkKey,
        nativeTokensAmount,
        tokensAmount,
        feeAmount,
        expiration,
        campaignId,
        signerSignature,
        receiverAddress,
        linkdropContract,
        sender,
        nft,
        tokenId
      }
    })
  }

  checkTransactionStatus ({ transactionId, chainId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_TRANSACTION_STATUS', payload: { transactionId, chainId } })
  }

  checkIfClaimed ({ linkKey, chainId, linkdropContract, senderAddress, campaignId }) {
    this.actions.dispatch({ type: '*TOKENS.CHECK_IF_CLAIMED', payload: { linkKey, chainId, linkdropContract, senderAddress, campaignId } })
  }
}

export default Tokens
