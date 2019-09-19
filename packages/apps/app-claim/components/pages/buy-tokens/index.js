import React from 'react'
import styles from './styles.module'
import { Icons } from '@linkdrop/ui-kit'

class BuyTokensPage extends React.Component {
  render () {
    return <div className={styles.container}>
      <div className={styles.close} onClick={_ => console.log('sss')}>
        <Icons.Close />
      </div>
      <iframe
        frameBorder='0'
        height='100%'
        src='https://buy-staging.moonpay.io?apiKey=pk_test_GRDFutdIwqATYOGe9EeZuiP9kLG05vX&currencyCode=eth&walletAddress=0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'
        width='100%'
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
  }
}

export default BuyTokensPage
