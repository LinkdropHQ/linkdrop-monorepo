import React from 'react'
import { Authorization } from 'components/pages'
//import './styles'
import { Loading } from '@linkdrop/ui-kit'
import connectToParent from 'penpal/lib/connectToParent'
import ConnectScreen from './../../pages/widget/dapp-connect'
import ConfirmTransactionScreen from './../../pages/widget/dapp-confirm'
import { actions } from 'decorators'
import AppRouter from '../router'
import { getHashVariables } from '@linkdrop/commons'
const EventEmitter = require('events')

@actions(({ user: { sdk, loading, privateKey, contractAddress, ens, loacale } }) => ({
  sdk,
  loading,
  privateKey,
  contractAddress,
  ens,
  loacale
}))
class WidgetRouter extends React.Component {
  constructor (props) {
    console.log("In constuctor")
    super(props)
    this.state = {
      screen: null,
      txParams: null,
      connected: false
    }

    this.eventEmitter = new EventEmitter()
  }
  
  async componentDidMount () {
    const { contractAddress } = this.props
    const { sdk } = this.props
    if (!sdk) { 
      let {
        chainId
      } = getHashVariables()
      chainId = chainId || '1'
      console.log("creating sdk")
      this.actions().user.createSdk({ chainId })
    }

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
      // // show modal
      // this.communication.showWidget()
      
      // wait for user input
      this.eventEmitter.on('userAction', ({ action, payload }) => {
        
        // resolve or reject
        if (action === 'confirm') {
          resolve(payload)
          setTimeout(() => {
            this.setState({ screen: null, connected: true })
          }, 500)

        } else { // on close click          
          this.communication.hideWidget()
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

    const { sdk, privateKey, contractAddress, ens } = this.props
    if (!sdk) {
      return <Loading />
    }
    
    // sdk
    if (sdk && (!ens || !privateKey || !contractAddress)) {
      return <Authorization />
    }
    
    if (this.state.connected && !this.state.screen) return this._renderAppRouter()

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

    return null
  }
  
  _renderAppRouter () {
    // rendering wallet router
    console.log("rendering wallet router")
    return <AppRouter />
  }
}

export default WidgetRouter
