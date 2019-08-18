import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Page } from 'components/pages'
import dapps from 'dapps'
import classNames from 'classnames'
import { Button } from '@linkdrop/ui-kit'

@actions(({ assets: { items, itemsToClaim }, user: { sdk, privateKey, contractAddress } }) => ({ items, sdk, privateKey, contractAddress }))
@translate('pages.confirm')
class Confirm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      dappPage: null,
      dappUrl: null,
      txParams: null,
      btnDisabled: false
    }

    window.addEventListener('message', this._receiveMessage.bind(this), false)
  }

  _closeWindow () {
    setTimeout(() => { // let post event before closing window
      window.close()
    }, 300)
  }

  _onCancelClick () {
    this.setState({ btnDisabled: true })
    this.dappPage.postMessage({ action: 'PASS_TRANSACTION_RESULT', payload: { success: false } },
      this.state.dappUrl)
    this._closeWindow()
  }

  async _onConfirmClick () {
    this.setState({ btnDisabled: true })

    const { sdk, privateKey, contractAddress } = this.props
    const {
      data,
      to,
      value
    } = this.state.txParams

    const message = {
      from: contractAddress,
      data: data || '0x0',
      to: to || '0x0',
      value: value || '0x0'
    }
    const { txHash, success, errors } = await sdk.execute(message, privateKey)

    console.log({ txHash, success, errors })
    // pass result to dapp window
    this.dappPage.postMessage({ action: 'PASS_TRANSACTION_RESULT', payload: { txHash, success } },
      this.state.dappUrl)

    // close this window
    this._closeWindow()
  }

  _receiveMessage (event) {
    // Do we trust the sender of this message?
    // if (event.origin !== DAPP_URL) return
    // console.log('got event from dapp: ', { event })
    // event.source is window.opener
    // Assuming you've verified the origin of the received message (which
    // you must do in any case), a convenient idiom for replying to a
    // message is to call postMessage on event.source and provide
    // event.origin as the targetOrigin.
    if (event.data.action === 'SEND_TRANSACTION') {
      const txParams = event.data.payload.txParams

      this.dappPage = event.source

      this.setState({
        txParams,
        dappUrl: event.origin,
        loading: false
      })
    }
  }

  render () {
    // waiting for SEND_TRANSACTION event with tx params data
    if (this.state.loading) {
      return (
        <div> loading... </div>
      )
    }

    // convert dapp object from { dappId: { url, label } -> key value obj { url: label }
    const dct = Object.keys(dapps).reduce((reducerDct, dappId) => {
      const { url, label } = dapps[dappId]
      reducerDct[url] = label
      return reducerDct
    }, {})

    const dappName = dct[this.state.dappUrl] || this.state.dappUrl

    return <Page dynamicHeader>
      <div className={classNames(styles.container)}>
        <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.main', { dappUrl: this.state.dappUrl, dappName }) }} />
        <div className={styles.buttonsContainer}>
          <Button disabled={this.state.btnDisabled} inverted className={styles.button} onClick={() => this._onCancelClick()}>{this.t('buttons.cancel')}</Button>
          <Button disabled={this.state.btnDisabled} className={styles.button} onClick={() => this._onConfirmClick()} >{this.t('buttons.confirm')}</Button>
        </div>
        <div className={styles.extraInfo} dangerouslySetInnerHTML={{ __html: this.t('descriptions.extraInfo') }} />
      </div>
    </Page>
  }
}

export default Confirm
