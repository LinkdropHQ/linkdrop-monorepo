import React from 'react'
import { Wallet, ethers } from 'ethers'
import './App.css'

const DAPP_URL = 'http://localhost:3001'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      address: null,
      balance: 0
    }

    this.provider = ethers.getDefaultProvider('mainnet')
    this.wallet = null
    window.addEventListener('message', this.receiveMessage.bind(this), false)
  }

  async _getPrivateKey () {
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
    return pk
  }
  
  async componentDidMount () {
    const pk = await this._getPrivateKey()
    
    // update ethereum wallet address
    this.wallet = new Wallet(pk, this.provider)
    const address = this.wallet.address

    const balance = (await this.provider.getBalance(address)).toString()
    console.log({ balance })
    this.setState({ address, balance })
  }

  receiveMessage (event) {
    // Do we trust the sender of this message?
    if (event.origin !== DAPP_URL) return
    console.log('got event from dapp: ', { event })
    // event.source is window.opener


    // Assuming you've verified the origin of the received message (which
    // you must do in any case), a convenient idiom for replying to a
    // message is to call postMessage on event.source and provide
    // event.origin as the targetOrigin.
    if (event.data.action === 'SEND_TRANSACTION') {
      const txParams = event.data.payload.txParams
      console.log({ txParams })
      
      setTimeout(async () => {
        if (window.confirm('Do you want to submit transaction?')) {       
          const {
            data,
            to,
            value,
            gasPrice
            // gas
          } = txParams
          
          let tx = await this.wallet.sendTransaction({
            data,
            to,
            value,
            gasPrice
            // gasLimit: gas
          })
          console.log('Tx sent: ', tx)
          
          // notifying that transaction have been sent
          event.source.postMessage({ action: 'PASS_TRANSACTION_RESULT', payload: { txHash: tx.hash, success: true } },
                                   event.origin)
        } else {
          event.source.postMessage({ action: 'PASS_TRANSACTION_RESULT', payload: { success: false } },
                                   event.origin)
        }
        
        setTimeout(() => { // let post event before closing window
          window.close()
        }, 0)
      })
    }
  }
  
  render () {
    const dappUrl = `${DAPP_URL}?user=dobrokhvalov.gitcoin.eth&network=mainnet`
    return (
        <div className='App'>
        <header className='App-header'>
        <p>
        Test Wallet
      </p>
        <p>
        Address: { this.state.address }
      </p>
        <p>
        Wei: { this.state.balance }
      </p>
      
        <a
      className='App-link'
      href={dappUrl}
        >
        Connect Dapp
      </a>
        </header>
        </div>
    )
  }
}

export default App
