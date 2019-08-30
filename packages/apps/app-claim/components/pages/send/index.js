import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import Header from './header'
import Assets from './assets'
import Input from './input'
import Contacts from './contacts'
import LinkPay from './link-pay'
import { getHashVariables } from '@linkdrop/commons'
import { Scrollbars } from 'react-custom-scrollbars'
import { ethers } from 'ethers'
import config from 'config-claim'

@actions(({ tokens: { transactionId, transactionStatus }, user: { chainId, loading, contractAddress }, assets: { items } }) => ({ transactionId, transactionStatus, items, loading, contractAddress, chainId }))
@translate('pages.send')
class Send extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sendTo: '',
      currentAsset: (props.items[0] || {}).tokenAddress,
      amount: 0,
      showTx: false
    }
  }

  componentWillReceiveProps ({ chainId, items, transactionId: id, transactionStatus: status }) {
    const { contractAddress, items: prevItems, transactionId: prevId, transactionStatus: prevStatus } = this.props
    if (id != null && prevId === null) {
      const { chainId } = getHashVariables()
      this.statusCheck = window.setInterval(_ => this.actions().tokens.checkTransactionStatus({ transactionId: id, chainId, statusToAdd: 'sent' }), 3000)
      window.setTimeout(_ => this.setState({
        showTx: true
      }), 2000)
    }
    if (items != null && items.length !== 0 && prevItems.length === 0) {
      this.setState({
        currentAsset: (items[0] || {}).tokenAddress
      })
    }
    if (status != null && status === 'sent' && prevStatus === null) {
      this.statusCheck && window.clearInterval(this.statusCheck)
      this.actions().assets.getItems({ chainId, wallet: contractAddress })
      this.setState({
        sendTo: '',
        amount: 0,
        showTx: false
      })
    }

    if (status != null && status === 'failed' && prevStatus === null) {
      this.statusCheck && window.clearInterval(this.statusCheck)
      alert(`unfortunately your transaction was failed, check txhash: ${id}`)
      this.actions().tokens.setTransactionId({ transactionId: null })
      this.setState({
        sendTo: '',
        amount: 0,
        showTx: false
      })
    }
  }

  componentWillUnmount () {
    this.statusCheck && window.clearInterval(this.statusCheck)
  }

  render () {
    const { sendTo, currentAsset, amount, showTx } = this.state
    const { loading, transactionId, chainId } = this.props
    return <Page hideHeader>
      <div className={styles.container}>
        <Header
          sendTo={sendTo}
          amount={amount}
          onChange={({ amount }) => this.setState({ amount })}
          onSend={_ => this.onSend()}
        />
        <Scrollbars style={{
          height: 'calc(100% - 90px)',
          width: '100%'
        }}
        >
          <div className={styles.content}>
            <Assets onChange={({ currentAsset }) => this.setState({ currentAsset })} currentAsset={currentAsset} />
            <Input
              onChange={({ value }) => this.setState({
                sendTo: value
              })}
              disabled={loading}
              value={sendTo}
              title={this.t('titles.to')}
              placeholder={this.t('titles.toPlaceholder')}
            />
            {false && <Input title={this.t('titles.for')} placeholder={this.t('titles.forPlaceholder')} />}
            {false && <Contacts />}
            {false && <LinkPay title={this.t('titles.payViaLink')} disabled={!amount || !Number(amount) || loading} />}
            {showTx && <div
              className={styles.note}
              dangerouslySetInnerHTML={{
                __html: this.t('texts.details', { link: `${chainId === '4' ? config.etherscanRinkeby : config.etherscanMainnet}${transactionId}` })
              }}
            />}
          </div>
        </Scrollbars>
      </div>
    </Page>
  }

  onSend () {
    const { items } = this.props
    const { sendTo, currentAsset, amount } = this.state
    const { decimals } = items.find(item => item.tokenAddress === currentAsset)
    if (currentAsset === ethers.constants.AddressZero) {
      this.actions().assets.sendEth({ to: sendTo, amount })
    } else {
      this.actions().assets.sendErc20({ to: sendTo, amount, tokenAddress: currentAsset, decimals })
    }
  }
}

export default Send
