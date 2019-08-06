import React from 'react'
import qs from 'querystring'
import './App.css'

const WALLET_URL = 'http://localhost:3000'

class App extends React.Component {
  constructor (props) {
    super(props)
    const address = this._getAddressFromUrl()
    this.state = {
      address
    }
    this.walletWindow = null
  }

  _getAddressFromUrl () {
    let address = null
    const paramsFragment = document.location.search.substr(1)
    if (paramsFragment) {
      const query = qs.parse(paramsFragment)
      console.log({ paramsFragment, query })
      address = query.address
    }
    return address
  }
  
  async componentDidMount () {
    // console.log('component did mount')
    // const walletWindow = window.opener
    // const message = { action: 'ASK_ADDRESS' }
    // walletWindow.postMessage(message, WALLET_URL)
    
    // this.walletWindow = walletWindow
    
    // window.addEventListener('message', this.receiveMessage.bind(this), false)
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
