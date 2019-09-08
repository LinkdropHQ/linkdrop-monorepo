import React from 'react'
import { translate, actions } from 'decorators'
import connectToParent from 'penpal/lib/connectToParent'
import ConnectScreen from './ConnectScreen'

const timeout = async ms => new Promise(resolve => setTimeout(resolve, ms))

@actions(({ user: { ens, contractAddress } }) => ({ ens, contractAddress }))
@translate('pages.dappConnect')
class WalletWidget extends React.Component {

  constructor (props) {
    console.log("In constuctor")
    super(props)
    this.waitingUserAction = false
    this.action = null
    this.state = {
      screen: null
    }
  }
  
  async componentDidMount () {
    const { contractAddress } = this.props
    
    const connection = connectToParent({
      // Methods child is exposing to parent
      methods: {
        connect: (ensName) => {
          return new Promise(async (resolve, reject) => {

            this.setState({
              screen: 'CONNECT_SCREEN'
            })
            
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

  _onCancelClick () {
    this.action = 'cancel'
    this.waitingUserAction = false
  }

  _onConfirmClick () {
    this.action = 'confirm'
    this.waitingUserAction = false
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
