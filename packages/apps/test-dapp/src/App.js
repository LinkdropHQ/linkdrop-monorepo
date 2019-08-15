/* global zeroExInstant */
import React from 'react'
import Provider from './provider'
import Web3 from 'web3'
import qs from 'querystring'
import './App.css'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      address: null
    }
    this.walletWindow = null
    this._connect()
  }

  _getParamsFromUrl () {
    let ensName, network
    const paramsFragment = document.location.search.substr(1)
    if (paramsFragment) {
      const query = qs.parse(paramsFragment)
      network = query.network || 'mainnet'
      ensName = query.user
    }
    return { ensName, network }
  }
  
  async _connect () {
    console.log('getting provider...')

    const { ensName, network } = this._getParamsFromUrl()
    const rpcUrl = `https://${network}.infura.io/v3/d4d1a2b933e048e28fb6fe1abe3e813a`
    console.log({ rpcUrl })
    const card = new Provider({ ensName, network, rpcUrl })

    await card.provider.enable()
    
    console.log('got provider')
    this.provider = card.provider
    this.web3 = new Web3(card.provider)
    console.log('got web3 ', this.web3)

    const accs = await this.web3.eth.getAccounts()
    console.log({ accs })
    const address = accs[0]
    this.setState({ address })

    const balance = await this.web3.eth.getBalance(address)
    console.log({ balance })
    
  }
  
  _onSubmit () {
    console.log("on submit clicked")
    // this.web3.eth.sendTransaction({ to: this.state.address, value: 0, from: this.state.address }, (err, result) => {
    //   console.log({ err, result })
    //   if (result) {
    //     alert(result)
    //   }
    // })

    zeroExInstant.render(
      {
        orderSource: 'https://api.radarrelay.com/0x/v2/',
        provider: this.provider
      },
      'body',
    )
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
