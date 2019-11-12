import React from 'react'
import styles from './styles.module'
import { Page } from 'components/pages'
import { actions } from 'decorators'
import { Loading } from '@linkdrop/ui-kit'

@actions(({ user: { wallet, privateKey, sdk } }) => ({ wallet, sdk, privateKey }))
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

  shouldComponentUpdate (nextProps, nextState) {
    const { loaded } = nextState
    console.log({ loaded })
    if (loaded) { return false }
    console.log('should reload')
    return true
  }

  render () {
    const { loaded } = this.state
    const { sdk, wallet, privateKey } = this.props
    if (!wallet) {
      return <Loading />
    }
    return <Page>
      <div className={styles.container}>
        <iframe
          frameBorder='0'
          height='100%'
          onLoad={_ => this.setState({ loaded: true })}
          src={`https://buy-staging.moonpay.io?apiKey=pk_test_8XCxJYhz1ztZR6AenQHE0UAfxPvCyrSI&currencyCode=eth&walletAddress=${wallet}&redirectURL=http%3A%2F%2Flocalhost%3A9004%2F%23%2Flink-generate`}
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
