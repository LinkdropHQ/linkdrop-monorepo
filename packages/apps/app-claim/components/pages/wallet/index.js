import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import { Loading } from '@linkdrop/ui-kit'
import { AccountBalance, TokensAmount } from 'components/common'
import { AssetsList } from 'components/pages/common'

@actions(({ tokens: { transactionData, transactionId, transactionStatus }, user: { chainId, loading, contractAddress, ens }, assets: { items } }) => ({
  transactionData,
  items,
  loading,
  contractAddress,
  ens,
  chainId,
  transactionId,
  transactionStatus
}))
@translate('pages.wallet')
class Wallet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sendingAssets: {}
    }
  }

  componentDidMount () {
    const { transactionData, items, transactionId, chainId } = this.props
    if (transactionData && transactionData.tokenAddress) {
      const currentItem = items.find(item => item.tokenAddress === transactionData.tokenAddress)
      if (!currentItem) { return }
      const { symbol } = currentItem
      this.setState({
        sendingAssets: {
          symbol,
          status: transactionData.status,
          amount: transactionData.value
        }
      }, _ => {
        // search for transaction only if status is not loading
        if (transactionData.status === 'finished') {
          this.hideLoader = window.setTimeout(_ => this.setState({
            sendingAssets: {}
          }, _ => {
            this.actions().tokens.setTransactionData({ transactionData: {} })
          }), 3000)
          return
        }
        this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ transactionId, chainId, statusToAdd: 'sent' }), 3000)
      })
    }
  }

  componentWillReceiveProps ({ contractAddress, chainId, transactionId: id, transactionStatus: status }) {
    const { transactionId: prevId, transactionStatus: prevStatus } = this.props
    const { sendingAssets } = this.state
    if (status != null && status === 'sent' && prevStatus === null) {
      this.actions().assets.getItems({ chainId, wallet: contractAddress })
    }

    if (status != null && status === 'failed' && prevStatus === null) {
      alert(`unfortunately your transaction was failed, check txhash: ${id}`)
      this.actions().tokens.setTransactionId({ transactionId: null })
    }

    if (status != null && (status === 'failed' || status === 'sent') && prevStatus === null) {
      this.statusCheck && window.clearInterval(this.statusCheck)
      this.setState({
        sendingAssets: {
          ...sendingAssets,
          status: status === 'failed' ? 'failed' : 'finished'
        }
      }, _ => {
        this.hideLoader = window.setTimeout(_ => this.setState({
          sendingAssets: {}
        }, _ => {
          this.actions().tokens.setTransactionData({ transactionData: {} })
          this.actions().tokens.setTransactionStatus({ transactionStatus: null })
        }), 3000)
      })
    }
  }

  componentWillUnmount () {
    this.hideLoader && window.clearTimeout(this.hideLoader)
    this.statusCheck && window.clearInterval(this.statusCheck)
  }

  render () {
    const { sendingAssets } = this.state
    const { items, loading, chainId } = this.props
    return <Page dynamicHeader note='⚠ T️his wallet is for testing only.<br>Use at your own risk'>
      <div className={styles.container}>
        <AccountBalance items={items} />
        {this.renderLoader({ sendingAssets })}
        <AssetsList />
      </div>
    </Page>
  }

  renderLoader ({ sendingAssets, chainId, transactionId }) {
    const { symbol, amount, status } = sendingAssets
    if (!amount || !symbol) { return null }
    return <TokensAmount
      chainId={chainId}
      transactionId={transactionId}
      sendLoading={status === 'loading'}
      symbol={symbol}
      sendingFinished={status === 'finished'}
      amount={amount}
    />
  }
}

export default Wallet
