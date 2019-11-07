/* global web3 */
import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import Web3Connect from 'web3connect'
import Web3 from 'web3'

@actions(({ campaigns: { items } }) => ({ items }))
@translate('pages.main')
class MetamaskInjector extends React.Component {
  constructor (props) {
    super(props)
    this.web3Connect = new Web3Connect.Core({
      providerOptions: {
        disableWalletConnect: true
      }
    })

    this.web3Connect.on('connect', provider => {
      this.applyProvider(provider)
    })
  }

  async applyProvider (provider) {
    // // temp hack for Nifty wallet
    // if (!provider.selectedAddress && web3 && web3.eth && web3.eth.accounts && web3.eth.accounts[0]) {
    //   provider.selectedAddress = web3.eth.accounts[0]
    //   provider.networkVersion = web3.version.network
    // }
    const web3Provider = new Web3(provider)
    if (web3Provider) {
      this.actions().user.checkCurrentProvider({ provider: web3Provider })
    }
  }

  render () {
    const { disabled } = this.props
    return <div className={styles.container}>
      <h2 className={styles.title}>{this.t('titles.metamaskSignIn')}</h2>
      <h3
        className={styles.subtitle}
        dangerouslySetInnerHTML={{ __html: this.t('titles.metamaksInstruction') }}
      />
      <Button
        disabled={disabled}
        className={styles.button}
        onClick={_ => this.web3Connect.toggleModal()}
      >
        {this.t('buttons.signIn')}
      </Button>
    </div>
  }
}

export default MetamaskInjector
