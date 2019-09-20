import React from 'react'
import styles from './styles.module'
import { Icons, Loading } from '@linkdrop/ui-kit'
import { prepareRedirectUrl } from 'helpers'

class BuyTokensPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true
    }
  }

  styleIFrame () {
    this.setState({ loading: false })
  }

  render () {
    const { loading } = this.state
    return <div className={styles.container}>
      <div className={styles.close} onClick={_ => { window.location.href = prepareRedirectUrl({ link: '/#/' }) }}>
        <Icons.Close />
      </div>
      {loading && <Loading withOverlay />}
      <iframe
        ref={node => { this.iframe = node }}
        frameBorder='0'
        height='100%'
        onLoad={_ => this.styleIFrame()}
        src='https://buy-staging.moonpay.io?apiKey=pk_test_GRDFutdIwqATYOGe9EeZuiP9kLG05vX&currencyCode=eth&walletAddress=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
        width='100%'
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
  }
}

export default BuyTokensPage
