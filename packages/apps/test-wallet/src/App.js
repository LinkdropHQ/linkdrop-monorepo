import React from 'react'
import { Wallet } from 'ethers'
import logo from './logo.svg'
import './App.css'


class App extends React.Component {
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
  }
  
  render () {
    return (
        <div className='App'>
        <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
        Test Wallet
      </p>
        <a
      className='App-link'
      href='https://reactjs.org'
      target='_blank'
      rel='noopener noreferrer'
        >
        Learn React
      </a>
        </header>
        </div>
    )
  }
}

export default App
