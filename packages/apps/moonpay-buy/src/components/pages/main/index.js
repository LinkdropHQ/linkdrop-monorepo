import React from 'react'
import styles from './styles.module'
import { Page } from 'components/pages'
import { actions } from 'decorators'
import { Loading } from '@linkdrop/ui-kit'

@actions(({ assets: { ethBalance }, user: { proxyAddress, privateKey, sdk } }) => ({
  proxyAddress,
  sdk,
  privateKey,
  ethBalance
}))
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  componentDidMount () {
    this.actions().user.createInitialData()
  }

  componentWillReceiveProps ({ ethBalance }) {
    const { ethBalance: prevEthBalance } = this.props
    if (!prevEthBalance && ethBalance) {
      if (window.balanceCheck) {
        window.clearInterval(window.balanceCheck)
        window.location.href = '/#/link-generate'
      }
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { loaded } = nextState
    if (loaded) { return false }
    return true
  }

  applyBalanceCheck () {
    if (window.balanceCheck) { window.clearInterval(window.balanceCheck) }
    window.balanceCheck = window.setInterval(_ => this.actions().assets.checkBalance(), 3000)
  }

  render () {
    const { loaded } = this.state
    const { sdk, proxyAddress, privateKey, ethBalance } = this.props
    if (!proxyAddress) {
      return <Loading />
    }
    return <Page>
      <div className={styles.container}>
        <iframe
          frameBorder='0'
          height='100%'
          onLoad={_ => this.setState({
            loaded: true
          }, _ => {
            this.applyBalanceCheck()
          })}
          src={`https://buy-staging.moonpay.io?apiKey=pk_test_8XCxJYhz1ztZR6AenQHE0UAfxPvCyrSI&currencyCode=eth&walletAddress=${proxyAddress}&redirectURL=http%3A%2F%2Flocalhost%3A9004%2F%23%2Floading`}
          width='100%'
        >
          <p>Your browser does not support iframes.</p>
        </iframe>
      </div>
    </Page>
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
