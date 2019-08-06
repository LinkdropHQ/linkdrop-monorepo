import React from 'react'
import { translate, actions } from 'decorators'
import commonStyles from '../styles.module'
import { getHashVariables } from '@linkdrop/commons'
import { TokensAmount, AssetBalance } from 'components/common'
import { getImages } from 'helpers'

@actions(({ tokens: { transactionId, transactionStatus } }) => ({ transactionId, transactionStatus }))
@translate('pages.main')
class ClaimingProcessPage extends React.Component {
  componentDidMount () {
    return
    const { wallet } = this.props
    const {
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      nftAddress,
      tokenId,
      weiAmount,
      campaignId
    } = getHashVariables()
    // destination: destination address - can be received from web3-react context
    // token: ERC20 token address, 0x000...000 for ether - can be received from url params
    // tokenAmount: token amount in atomic values - can be received from url params
    // expirationTime: link expiration time - can be received from url params
    if (nftAddress && tokenId) {
      return this.actions().tokens.claimTokensERC721({ wallet, campaignId, nftAddress, tokenId, weiAmount, expirationTime, linkKey, linkdropSignerSignature })
    }

    this.actions().tokens.claimTokensERC20({ campaignId, wallet, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature })
  }

  componentWillReceiveProps ({ transactionId: id, transactionStatus: status }) {
    const { transactionId: prevId, transactionStatus: prevStatus } = this.props
    if (id != null && prevId === null) {
      const { chainId } = getHashVariables()
      this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ transactionId: id, chainId }), 3000)
    }
    if (status != null && prevStatus === null) {
      this.statusCheck && window.clearInterval(this.statusCheck)
      this.actions().user.setStep({ step: 5 })
    }
  }

  render () {
    const { chainId, weiAmount } = getHashVariables()
    const { transactionId, symbol, amount, decimals, icon } = this.props

    return <div className={commonStyles.container}>
      <TokensAmount loading symbol={symbol} amount={amount} decimals={decimals} />
      <AssetBalance loading symbol={symbol} amount={amount} decimals={decimals} icon={icon} />
      {weiAmount && Number(weiAmount) > 0 && <AssetBalance loading symbol='ETH' amount={weiAmount} decimals={18} icon={getImages({ src: 'ether' }).imageRetina} />}
    </div>
  }
}

export default ClaimingProcessPage
