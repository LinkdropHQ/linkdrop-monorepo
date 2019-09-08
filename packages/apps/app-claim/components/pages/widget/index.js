import React from 'react'
import { translate, actions } from 'decorators'
import connectToParent from 'penpal/lib/connectToParent'
import ConnectScreen from './dapp-connect'
import ConfirmTransactionScreen from './dapp-confirm'
const EventEmitter = require('events')

@actions(({ user: { ens, contractAddress } }) => ({ ens, contractAddress }))
@translate('pages.dappConnect')
class WalletWidget extends React.Component {
  constructor (props) {
    console.log("In constuctor")
    super(props)
    this.state = {
      screen: null,
      txParams: null
    }

    this.eventEmitter = new EventEmitter()
  }
  
  async componentDidMount () {
    const { contractAddress } = this.props
    
    const connection = connectToParent({
      // Methods child is exposing to parent
      methods: {
        sendTransaction: async (txParams) => {
          console.log({ txParams })
          this.setState({
            screen: 'CONFIRM_TRANSACTION_SCREEN',
            txParams
          })
          return this._showModalAndWaitUserAction()
        },
        connect: (ensName) => {
          this.setState({ screen: 'CONNECT_SCREEN' })
          return this._showModalAndWaitUserAction()
        },
        getAccounts () {
          console.log('WALLET: getting accounts: ', contractAddress)
          return [contractAddress]
        }
      }
    })
    this.communication = await connection.promise        
  }

  _showModalAndWaitUserAction () { 
    return new Promise(async (resolve, reject) => {
      // show modal
      this.communication.showWidget()
      
      // wait for user input
      this.eventEmitter.on('userAction', ({ action, payload }) => {

        // hide modal
        this.communication.hideWidget()

        // resolve or reject
        if (action === 'confirm') {
          resolve(payload)
        } else {
          reject(new Error('User rejected action'))
        }
      })
    })
  }
  
  _onCancelClick () {
    this.eventEmitter.emit('userAction', { action: 'cancel', payload: null })
  }

  _onConfirmClick (result) {
    this.eventEmitter.emit('userAction', { action: 'confirm', payload: result })
  }
  
  render () {
    if (!this.state.screen) return null

    if (this.state.screen === 'CONNECT_SCREEN') {
      return <ConnectScreen
      onConfirmClick={this._onConfirmClick.bind(this)}
      onCancelClick={this._onCancelClick.bind(this)} />
    }

    if (this.state.screen === 'CONFIRM_TRANSACTION_SCREEN') {
      return <ConfirmTransactionScreen
      txParams={this.state.txParams}
      onConfirmClick={this._onConfirmClick.bind(this)}
      onCancelClick={this._onCancelClick.bind(this)} />      
    }    
  }
}

export default WalletWidget
