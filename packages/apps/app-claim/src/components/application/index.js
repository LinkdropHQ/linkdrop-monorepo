import React from 'react'
import { Provider } from 'react-redux'
import { Web3ReactProvider } from "@web3-react/core"
import connectors from './connectors'
import RouterProvider from './router-provider'
import store from 'data/store'
import Web3 from 'web3'

function getLibrary(provider) {
  return new Web3(provider);
}

class Application extends React.Component {
  render () {
    return <Web3ReactProvider
      getLibrary={getLibrary}
    >
      <Provider store={store()}>
        <RouterProvider />
      </Provider>
    </Web3ReactProvider>
  }
}
export default Application
