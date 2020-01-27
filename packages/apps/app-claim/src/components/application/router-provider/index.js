import React, { useEffect } from 'react'
import { useWeb3React } from "@web3-react/core"
import connectors from '../connectors'
import { Router } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { history } from 'data/store'
import { Loading } from '@linkdrop/ui-kit'
import AppRouter from '../router'
import { getHashVariables } from '@linkdrop/commons'

export default function RouterProvider () {
  const context = useWeb3React()
  const { connector } = getHashVariables()
  useEffect(() => {
    context.activate(defineConnectors({ connector }))
  }, [])

  if (!context.active && !context.error) {
    return <Loading />
  } else if (context.error) {
    console.log({ error: context.error })
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

const defineConnectors = ({ connector }) => {
  // if (connector) {
  //   return [connector, 'Network']
  // }
  // return ['MetaMask', 'Network']
  if (connector) {
    return connectors[connector]
  }
  return connectors['Metamask']
}
