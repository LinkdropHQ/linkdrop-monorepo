import React from 'react'
import { DappHeader } from 'components/common'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import connectToParent from 'penpal/lib/connectToParent'

@actions(({ user: { ens, contractAddress } }) => ({ ens, contractAddress }))
@translate('pages.dappConnect')
class DappConnect extends React.Component {
  
  async componentDidMount () {

    const { contractAddress } = this.props
    
    const connection = connectToParent({
      // Methods child is exposing to parent
      methods: {
        connect (ensName) {
          // 1. show modal
          // 2. verify ens
          // return ens
        },
        getAccounts () {
          console.log('WALLET: getting accounts: ', contractAddress)
          return [contractAddress]
        }
      }
    })
    this.communication = await connection.promise        
  }

  _closeModal () {
    this.communication.hideWidget()
  }
  
  render () {
    const { ens } = this.props
    return <div className={styles.container}>
      <DappHeader
        title={this.t('titles.wallet')}
        onClose={this._closeModal.bind(this)}
      />

      <div className={styles.content}>
        <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.loggedIn', { ens }) }} />
      <Button
        className={styles.button}
        onClick={this._closeModal.bind(this)}
        >
          {this.t('buttons.continue')}
        </Button>
      </div>
      <div
        className={styles.footer}
        dangerouslySetInnerHTML={{ __html: this.t('texts.dapp') }}
      />
    </div>
  }
}

export default DappConnect
