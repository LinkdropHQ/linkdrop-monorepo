import React from 'react'
import { Wallet } from 'ethers'
import './App.css'

const DAPP_URL = 'http://localhost:3001'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      address: null
    }
  }
  
  async componentDidMount () {
    console.log('component did mount')
    let pk = await window.localStorage.getItem('pkKey')
    console.log({ pk })
    if (!pk) {
      console.log('Generating new private key..')
      pk = Wallet.createRandom().privateKey
      console.log({ pk })
      window.localStorage.setItem('pkKey', pk)
    } else {
      console.log('found existing pk: ', pk)
    }

    // update ethereum wallet address
    const address = new Wallet(pk).address
    this.setState({ address })
    
    window.addEventListener('message', this.receiveMessage.bind(this), false)
  }

  receiveMessage (event) {
    // Do we trust the sender of this message?
    if (event.origin !== DAPP_URL) return
    console.log('got event from dapp: ', { event })
    // event.source is window.opener
    // event.data is 'hello there!'

    // Assuming you've verified the origin of the received message (which
    // you must do in any case), a convenient idiom for replying to a
    // message is to call postMessage on event.source and provide
    // event.origin as the targetOrigin.
    if (event.data.action === 'ASK_ADDRESS') {
      event.source.postMessage({ action: 'PASS_ADDRESS', payload: { address: this.state.address } },
                               event.origin)
    } else if (event.data.action === 'SEND_TRANSACTION') {
      console.log('sending transaction')
      window.alert('sending transaction')

      // notifying that transaction have been sent
      event.source.postMessage({ action: 'PASS_TRANSACTION_RESULT', payload: { txHash: '0x000', success: true } },
                               event.origin)

      setTimeout(() => { // let post event before closing window
        window.close()
      }, 0)
    }
  }
  
  render () {
    return (
        <div className='App'>
        <header className='App-header'>
        <p>
        Test Wallet
      </p>
        <p>
        Address: { this.state.address }
      </p>
      
        <a
      className='App-link'
      href={DAPP_URL}
      target='_blank'
        >
        Connect With Dapp
      </a>
        </header>
        </div>
    )
  }
}

export default App
