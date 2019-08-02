import React from 'react'
import logo from './logo.svg'
import './App.css'


class App extends React.Component {
  async componentDidMount () {
    console.log('component did mount')
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
