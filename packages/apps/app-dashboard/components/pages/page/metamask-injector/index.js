/* global web3 */
import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import Web3Connect from 'web3connect'

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

    // temp hack for Nifty wallet 
    if (!provider.selectedAddress && web3 && web3.eth && web3.eth.accounts && web3.eth.accounts[0]) {
      provider.selectedAddress = web3.eth.accounts[0]
      provider.networkVersion = web3.version.network
    }

    // TODO: this should be changed as only Metamask suppports `provider.selectedAddress`
    // better to use web3.eth.getAccounts() or web.eth.accounts[0]
    // another TODO: don't use web3 as global variable!
    if (provider.selectedAddress) {
      this.actions().user.checkCurrentProvider()
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
      <div className={styles.button}>
        <Button
          disabled={disabled}
          onClick={_ => this.web3Connect.toggleModal()}
        >
          {this.t('buttons.signIn')}
        </Button>
      </div>
    </div>
  }
}

export default MetamaskInjector
