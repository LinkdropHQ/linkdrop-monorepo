import React from 'react'
import { translate, actions } from 'decorators'
import connectToParent from 'penpal/lib/connectToParent'
import ConnectScreen from './dapp-connect'
const EventEmitter = require('events')

@actions(({ user: { ens, contractAddress } }) => ({ ens, contractAddress }))
@translate('pages.dappConnect')
class WalletWidget extends React.Component {
  constructor (props) {
    console.log("In constuctor")
    super(props)
    this.state = {
      screen: null
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
        },
        connect: (ensName) => {
          return new Promise(async (resolve, reject) => {

            this.setState({
              screen: 'CONNECT_SCREEN'
            })
            
            // 1. show modal
            this.communication.showWidget()
            this.waitingUserAction = true
            
            // wait for user input
            this.eventEmitter.on('userAction', (action) => { 
              this.communication.hideWidget()
              if (action === 'confirm') {
                resolve()
              } else {
                reject(new Error('User rejected action'))
              }
            })

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

  _onCancelClick () {
    this.eventEmitter.emit('userAction', 'cancel')
  }

  _onConfirmClick () {
    this.eventEmitter.emit('userAction', 'confirm')
  }
  
  render () {
    if (!this.state.screen) return null

    if (this.state.screen === 'CONNECT_SCREEN') {
      return <ConnectScreen
      onConfirmClick={this._onConfirmClick.bind(this)}
      onCancelClick={this._onCancelClick.bind(this)} />
    }

    // if (this.state.screen === 'CONFIRM_TRANSACTION_SCREEN') {
    //   return null
    // }    
  }
}

export default WalletWidget