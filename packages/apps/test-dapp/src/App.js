import React from 'react'
import './App.css'

const WALLET_URL = 'http://localhost:3000'

class App extends React.Component {
  async componentDidMount () {
    console.log('component did mount')
    const walletWindow = window.opener
    const walletOrigin = WALLET_URL
    const message = 'Hello Wallet'
    walletWindow.postMessage(message, walletOrigin)

    window.addEventListener('message', this.receiveMessage.bind(this), false)
  }

  receiveMessage (event) {
    // Do we trust the sender of this message?
    if (event.origin !== WALLET_URL) return
    console.log('got event from wallet: ', { event })
    // event.source is window.opener
    // event.data is 'hello there!'
  }
  
  render () {
    return (
        <div className='App'>
        <header className='App-header'>
        <p>
        My Amazing Dapp
      </p>
      
        <a
      className='App-link'
      href='https://reactjs.org'
      target='_blank'
      rel='noopener noreferrer'
        >
        Submit Tx
      </a>
        </header>
        </div>
    )
  }
}

export default App
