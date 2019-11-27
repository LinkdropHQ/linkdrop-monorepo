import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { Router } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { defineConnectors } from 'helpers'
import { history } from 'data/store'
import { Loading } from '@linkdrop/ui-kit'
import AppRouter from '../router'
import { getHashVariables } from '@linkdrop/commons'
export default function RouterProvider () {
  const { w } = getHashVariables()
  const connectors = defineConnectors({ defaultWallet: w })
  const context = useWeb3Context()
  useEffect(() => {
    context.setFirstValidConnector(connectors)
  }, [])

  if (!context.active && !context.error) {
    return <Loading />
  } else if (context.error) {
    return <ConnectedRouter history={history}>
      <Router history={history}>
        <AppRouter web3Provider={null} context={context} />
      </Router>
    </ConnectedRouter>
  } else {
    return <ConnectedRouter history={history}>
      <Router history={history}>
        <AppRouter web3Provider={context.library._web3Provider} context={context} />
      </Router>
    </ConnectedRouter>
  }
}
