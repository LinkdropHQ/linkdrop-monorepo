import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { HashRouter } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { history } from 'data/store'
import { Loading } from '@linkdrop/ui-kit'
import AppRouter from '../router'

export default function RouterProvider () {
  const context = useWeb3Context()

  useEffect(() => {
    context.setFirstValidConnector(['MetaMask', 'Infura'])
  }, [])

  if (!context.active && !context.error) {
    return <Loading />
  } else if (context.error) {
    return <div>error: {context.error.code} (line: {context.error.line}, col: {context.error.column})</div>
  } else {
    return <ConnectedRouter history={history}>
      <HashRouter history={history}>
        <AppRouter />
      </HashRouter>
    </ConnectedRouter>
  }
}
