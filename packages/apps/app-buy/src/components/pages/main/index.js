/* global Wyre */
import React from 'react'
import styles from './styles.module'
import { Page } from 'components/pages'
import { actions, translate } from 'decorators'
import { Loading } from '@linkdrop/ui-kit'
import { Button } from 'components/common'
import { moonpayApiKey, sendWyreAccountId } from 'config'

@actions(({ assets: { ethBalance }, link: { link, claimed }, user: { proxyAddress, privateKey, sdk } }) => ({
  proxyAddress,
  sdk,
  privateKey,
  ethBalance,
  link,
  claimed
}))
@translate('pages.main')
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  componentDidMount () {
    const { match = {} } = this.props
    const { application = 'moonpay' } = match.params || {}
    this.actions().user.createInitialData({ application })
  }

  componentWillReceiveProps ({ ethBalance }) {
    const {
      ethBalance: prevEthBalance
    } = this.props

    if (!prevEthBalance && ethBalance) {
      if (window.balanceCheck) {
        window.clearInterval(window.balanceCheck)
        window.location.href = '/#/link-generate'
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { loaded } = nextState
    const { loaded: currentLoaded } = this.state
    if (loaded && currentLoaded) { return false }
    return true
  }

  applyBalanceCheck () {
    if (window.balanceCheck) { window.clearInterval(window.balanceCheck) }
    window.balanceCheck = window.setInterval(_ => {
      this.actions().assets.checkBalance()
    }, 3000)
  }

  render () {
    const { loaded } = this.state
    const { sdk, proxyAddress, privateKey, ethBalance, match = {} } = this.props
    const { application = 'moonpay' } = match.params || {}
    
    if (!proxyAddress) { return <Page>
      <div className={styles.container}>
        <Loading withOverlay />
      </div>
    </Page>}
    return <Page>
      <div className={styles.container}>
        {!loaded && <Loading withOverlay />}
        {this.renderApplication({ application, moonpayApiKey, proxyAddress })}
      </div>
    </Page>
  }

  renderApplication ({ application, moonpayApiKey, proxyAddress }) {
    if (application === 'moonpay') {
      return this.renderMoonpay({ moonpayApiKey, proxyAddress })
    }

    return this.renderSendWyre({ proxyAddress })
  }

  renderSendWyre ({ proxyAddress }) {
    const { link } = this.props
    if (link) { return null }
    const widget = new Wyre({
      env: 'test',
      accountId: sendWyreAccountId,
      operation: {
        type: 'debitcard',
        dest: `ethereum:${proxyAddress}`,
        destCurrency: "ETH",
        sourceAmount: 290.0,
        paymentMethod: 'google-pay'
      }
    });
    widget.on('ready', _ => {
      this.setState({
        loaded: true
      })
    })
  
    widget.open();
    return <div className={styles.fakeButton}><Button onClick={_ => {
      {/*window.setTimeout(_ => this.applyBalanceCheck(), 3000)*/}
      window.location.href = '/#/loading'
      widget.close()
    }}>
      {this.t('buttons.buy')}
    </Button></div>
  }

  defineIframeSrc ({ application, moonpayApiKey, proxyAddress }) {
    return `https://buy-staging.moonpay.io?apiKey=${moonpayApiKey}&currencyCode=eth&walletAddress=${proxyAddress}&redirectURL=${encodeURIComponent(`${window.location.origin}/#/loading?proxyAddress=${proxyAddress}`)}`
  }

  renderMoonpay ({ application, moonpayApiKey, proxyAddress }) {
    const iframeSrc = this.defineIframeSrc({ application, moonpayApiKey, proxyAddress })
    return <iframe
      frameBorder='0'
      height='100%'
      onLoad={_ => this.setState({
        loaded: true
      }, _ => {
        this.applyBalanceCheck()
      })}
      src={iframeSrc}
      width='100%'
    >
      <p>Your browser does not support iframes.</p>
    </iframe>
  }
}

export default Main

// getProxyAddress (campaingId = 0) {
//   return computeProxyAddress(
//     this.factoryAddress,
//     this.senderAddress,
//     campaingId
//   )
// }
