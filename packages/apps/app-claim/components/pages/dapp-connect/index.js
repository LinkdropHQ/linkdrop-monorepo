import React from 'react'
import { DappHeader } from 'components/common'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import connectToParent from 'penpal/lib/connectToParent'

const timeout = async ms => new Promise(resolve => setTimeout(resolve, ms))

@actions(({ user: { ens, contractAddress } }) => ({ ens, contractAddress }))
@translate('pages.dappConnect')
class DappConnect extends React.Component {

  constructor (props) {
    console.log("In constuctor")
    super(props)
    this.waitingUserAction = false
    this.action = null
  }
  
  async componentDidMount () {
    const { contractAddress } = this.props
    
    const connection = connectToParent({
      // Methods child is exposing to parent
      methods: {
        connect: (ensName) => {
          return new Promise(async (resolve, reject) => {
            // 1. show modal
            this.communication.showWidget()

            this.waitingUserAction = true
            
            // wait for user input
            while (this.waitingUserAction === true) await timeout(300)
            
            this.communication.hideWidget()
            if (this.action === 'confirm') {
              resolve()
            } else { 
              reject(new Error('User rejected action'))
            }

            this.action = null
          })
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
    this.action = 'cancel'
    this.waitingUserAction = false
  }

  _onConfirmClick () {
    this.action = 'confirm'
    this.waitingUserAction = false
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
        onClick={this._onConfirmClick.bind(this)}
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
