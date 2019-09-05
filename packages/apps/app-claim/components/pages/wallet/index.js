import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import { Icons, Loading, Button } from '@linkdrop/ui-kit'
import { AssetBalance, AccountBalance, TokensAmount } from 'components/common'
import classNames from 'classnames'
import { countFinalPrice } from 'helpers'
import { getHashVariables, defineNetworkName } from '@linkdrop/commons'
import dapps from 'dapps'

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
      expandAssets: false,
      sendingAssets: {}
    }
  }

  componentDidMount () {
    const { transactionData, items, transactionId, chainId } = this.props
    console.log({ transactionData })
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
        console.log('staring to check!')
        this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ transactionId, chainId, statusToAdd: 'sent' }), 3000)
      })
    }
  }

  componentWillReceiveProps ({ contractAddress, chainId, transactionId: id, transactionStatus: status }) {
    const { transactionId: prevId, transactionStatus: prevStatus } = this.props
    const { sendingAssets } = this.state
    console.log({ status, prevStatus })
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

  renderDappButton () {
    const {
      dappId
    } = getHashVariables()
    if (!dappId) { return null }
    const dapp = dapps[dappId]
    if (!dapp) { return null }
    const { label, url } = dapp
    const { ens } = this.props
    const { chainId } = getHashVariables()
    const network = defineNetworkName({ chainId })
    const confirmUrl = encodeURIComponent(`${window.origin}/#/confirm`)
    const dappUrl = `${url}?user=${ens}&network=${network}&confirmUrl=${confirmUrl}`
    return <Button className={styles.button} inverted href={dappUrl} target='_blank'>{this.t('buttons.goTo', { title: label })}</Button>
  }

  render () {
    const { expandAssets, sendingAssets } = this.state
    const { items, loading, chainId } = this.props
    const finalPrice = countFinalPrice({ items })
    return <Page dynamicHeader>
      <div className={styles.container}>
        {loading && <Loading withOverlay />}
        <AccountBalance balance={finalPrice} />
        {this.renderLoader({ sendingAssets })}
        <div className={classNames(styles.assets, { [styles.assetsExpanded]: expandAssets })}>
          <div className={styles.assetsHeader} onClick={_ => this.setState({ expandAssets: !expandAssets })}>
            {this.t('titles.digitalAssets')}
            <Icons.PolygonArrow fill='#000' />
          </div>
          <div className={styles.assetsContent}>
            <div className={styles.assetsContentItems}>
              {items.map(({
                icon,
                symbol,
                balanceFormatted,
                tokenAddress,
                price
              }) => <AssetBalance
                key={tokenAddress}
                symbol={symbol}
                amount={balanceFormatted}
                price={price}
                icon={icon}
              />)}
            </div>
            {this.renderDappButton()}
          </div>
        </div>
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
