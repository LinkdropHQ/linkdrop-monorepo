import React from 'react'
import { ethers } from 'ethers'
import Provider from './provider'
import Web3 from 'web3'
import './App.css'

const WALLET_URL = 'http://localhost:3000'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      address: null
    }
    this.walletWindow = null
    this._connect()
  }

  _connect () {
    console.log('getting provider...')
    const card = new Provider()
    console.log('got provider')
    const web3 = new Web3(card.provider)
    console.log('got web3 ', web3)

    web3.eth.getAccounts()
      .then((accs) => {
        console.log({ accs })
        const address = accs[0]
        this.setState({ address })
      })
  }
  
  async componentDidMount () {
    // const persistedAddress = await window.localStorage.getItem('@connect/address')
    // if (this.state.address) {
    //   if (this.state.address !== persistedAddress) {
    //     window.localStorage.setItem('@connect/address', this.state.address)
    //   } 
    // } else if (persistedAddress) {
    //   this.setState({ address: persistedAddress })
    // }
  }

  receiveMessage (event) {
    // Do we trust the sender of this message?
    if (event.origin !== WALLET_URL) return

    if (event.data.action === 'PASS_TRANSACTION_RESULT') {
      console.log('received tx result', event.data.payload)
      const { success, txHash } = event.data.payload
      let message
      if (success) {
        message = `Got txHash: ${txHash}`
      } else {
        message = 'Transaction was rejected by user'
      }
      setTimeout(() => {
        window.alert(message)
      }, 100)
    }
  }

  _onSubmit () {
    const newWindow = window.open(WALLET_URL, '_blank')
    console.log('sending transaction')
    setTimeout(() => {
      const message = { action: 'SEND_TRANSACTION' }
      newWindow.postMessage(message, WALLET_URL)
    }, 1000)
  }
  
  render () {
    return (
        <div className='App'>
        <header className='App-header'>
        <p>
        My Amazing Dapp
      </p>

        <p>
        Address: {this.state.address || 'Not connected' }
      </p>
      
        <button
      className='App-link'
      onClick={this._onSubmit.bind(this)}
        >
        Submit Tx
      </button>
        </header>
        </div>
    )
  }
}

export default App
