/* global web3 */
import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import Web3Connect from 'web3connect'
import Web3 from 'web3'
import WalletConnectProvider from "@walletconnect/web3-provider";
import Portis from "@portis/web3";
import Fortmatic from "fortmatic";
import { getHashVariables, defineNetworkName } from '@linkdrop/commons'
import { infuraPk, portisDappId, formaticApiKeyTestnet, formaticApiKeyMainnet } from 'app.config.js'


@actions(({ campaigns: { items } }) => ({ items }))
@translate('pages.main')
class Web3Injector extends React.Component {
  constructor (props) {
    super(props)
    const { chainId = '1' } = getHashVariables()
    const networkName = defineNetworkName({ chainId })
    this.web3Connect = new Web3Connect.Core({
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: infuraPk,
            network: networkName
          }
        },
        portis: {
          package: Portis,
          options: {
            id: portisDappId,
            network: networkName
          }
        },
        fortmatic: {
          package: Fortmatic,
          options: {
            key: Number(chainId) === 1 ? formaticApiKeyMainnet : formaticApiKeyTestnet,
            network: networkName
          }
        },
      }
    })

    this.web3Connect.on('connect', provider => {
      this.applyProvider(provider)
    })
  }

  async applyProvider (provider) {
    const web3Provider = new Web3(provider)
    if (web3Provider) {
      this.actions().user.checkCurrentProvider({ provider: web3Provider })
    }
  }

  render () {
    const { disabled } = this.props
    return <div className={styles.container}>
      <h2 className={styles.title}>{this.t('titles.connectorSignIn')}</h2>
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

export default Web3Injector
