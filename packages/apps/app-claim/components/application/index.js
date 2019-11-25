import React from 'react'
import { Provider } from 'react-redux'
import Web3Provider from 'web3-react'
import connectors from './connectors'
import RouterProvider from './router-provider'

import store from 'data/store'

class Application extends React.Component {
  render () {
    return <Web3Provider
      connectors={connectors}
      libraryName='ethers.js'
    >
      <Provider store={store()}>
        <RouterProvider />
      </Provider>
    </Web3Provider>
  }
}
export default Application
