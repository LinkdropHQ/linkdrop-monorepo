/* global zeroExInstant */
import React from 'react'
import WalletProvider from '@linkdrop/wallet-provider'
import Web3 from 'web3'
import qs from 'querystring'
import './App.css'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      address: null,
      connected: false,
      ensNameInput: '',
      loading: true
    }
    this.walletWindow = null    
  }

  async componentDidMount () {
    const { ensName, network, widgetUrl } = this._getParamsFromUrl()
    this.network = network
    if (ensName) {
      this._connect(ensName, network, widgetUrl)
    }
    this.setState({
      loading: false
    })
  }
  
  _getParamsFromUrl () {
    let ensName
    let widgetUrl
    let network = 'mainnet'

    const paramsFragment = document.location.search.substr(1)
    if (paramsFragment) {
      const query = qs.parse(paramsFragment)
      network = query.network || 'mainnet'
      ensName = query.user
      if (query.widgetUrl) {
        widgetUrl = decodeURIComponent(query.widgetUrl)
      }      
    }
    return { ensName, network, widgetUrl }
  }
  
  async _connect (ensName, network, widgetUrl) {
    try {
      const urlParams = this._getParamsFromUrl()

      ensName = ensName || urlParams.ensName
      network = network || urlParams.network
      widgetUrl = widgetUrl || urlParams.widgetUrl
      
      console.log('getting provider...')
      const card = new WalletProvider({ ensName, network, widgetUrl })
      
      await card.provider.enable()
      
      console.log('got provider')
      this.provider = card.provider
      this.web3 = new Web3(card.provider)
      // console.log('got web3 ', this.web3)

      const accs = await this.web3.eth.getAccounts()
      console.log({ accs })
      const address = accs[0]
      this.setState({ address })

      const balance = await this.web3.eth.getBalance(address)
      this.setState({
        connected: true,
        ensName
      })
      console.log({
        balance
      })

      this._openZrxInstantModal()
    } catch (error) {
      const errMsg = 'Error connecting with ENS'
      console.log(errMsg)
      console.log(error)
    }
  }

  _submitTestTx () {
    this.web3.eth.sendTransaction({
      to: '0xF695e673d7D159CBFc119b53D8928cEca4Efe99e',
      value: 2019,
      from: this.state.address
    }, (err, result) => {
      console.log({ err, result })
      if (result) {
        window.alert(result)
      }
   })
  }
  
  _openZrxInstantModal () {
    console.log('on submit clicked')
    zeroExInstant.render(
      {
          orderSource: 'https://api.radarrelay.com/0x/v2/',
          provider: this.provider
        },
      'body'
    )
  }

  _renderIfNotLoggedIn () {
    return (
      <div>
        <h3> Connect your account </h3>
        <input className='ens-input' placeholder='Your ENS, e.g. user.my-wallet.eth' type='text' name='ens' onChange={({ target }) => this.setState({ ensNameInput: target.value })} />
        <br/>
        <button className='App-link' onClick={() => {
          this._connect(this.state.ensNameInput)
        }}>Connect</button>

        <p style={{ fontSize: 10, textDecoration: 'none', marginTop: 30 }}>
        Don't have an account?  <a style={{ color: 'blue' }} href='http://localhost:3000' target='_blank' ref='no-follow'> Create new one </a>
        </p>
      </div>
    )
  }

  _renderButton () {
    if (this.network === 'rinkeby') {
      return (
     <button
      className='App-link'
      onClick={this._submitTestTx.bind(this)}
        >
          Submit Test Tx
        </button>
      )
     }

    return (
     <button
      className='App-link'
      onClick={this._openZrxInstantModal.bind(this)}
        >
          Continue
      </button>
    )
  }

  _renderIfLoggedIn () {
    return (
          <div>
        <p>
        Logged in as <span style={{fontWeight: 'bold'}}> {this.state.ensName} </span>
        <br/>
        <small> { this.state.address } </small>
        </p>
        
      { this._renderButton() }
   

        <p>
        <a style={{ fontSize: 10, color: 'blue', textDecoration: 'none' }} onClick={() => {
          this.setState({
            ensNameInput: null,
            ensName: null,
            connected: false
          })
        }} href='javascript:;'> Logout </a>
        </p>
        </div>
    )
  }
  
  render () {
    if (this.state.loading) {
      return (<div>Loading...</div>)
    }    
    return (
        <div className='App'>
        <header className='App-header'>
        <h1>
        0x Instant Demo      
      </h1>

      {
        this.state.connected ? this._renderIfLoggedIn() : this._renderIfNotLoggedIn()
      }
        </header>
        </div>
    )
  }
}

export default App
