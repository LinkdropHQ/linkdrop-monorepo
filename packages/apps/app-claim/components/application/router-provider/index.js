import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { Router } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { history } from 'data/store'
import { Loading } from '@linkdrop/ui-kit'
import AppRouter from '../router'
import { definePlatform } from '@linkdrop/commons'
const platform = definePlatform()

export default function RouterProvider () {
  const context = useWeb3Context()
  const connectors = platform === 'desktop' ? ['MetaMask', 'Infura', 'WalletConnect', 'Fortmatic', 'Portis'] : ['MetaMask', 'Infura']
  useEffect(() => {
    context.setFirstValidConnector(connectors)
  }, [])

  if (!context.active && !context.error) {
    return <Loading />
  } else if (context.error) {
    console.log(`error: ${context.error.code} (line: ${context.error.line}, col: ${context.error.column})`)
    return <div>{`error: ${context.error.code} (line: ${context.error.line}, col: ${context.error.column})`}</div>
  } else {
    return <ConnectedRouter history={history}>
      <Router history={history}>
        <AppRouter web3Provider={context.library._web3Provider} context={context} />
      </Router>
    </ConnectedRouter>
  }
}
