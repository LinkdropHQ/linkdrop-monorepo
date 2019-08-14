import React from 'react'
import Provider from './provider'
import Web3 from 'web3'
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

  async _connect () {
    console.log('getting provider...')
    const card = new Provider()

    await card.provider.enable()
    
    console.log('got provider')
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
    this.web3.eth.sendTransaction({ to: this.state.address, value: 0, from: this.state.address }, (err, result) => {
      console.log({ err, result })
      if (result) {
        alert(result)
      }
    })
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
