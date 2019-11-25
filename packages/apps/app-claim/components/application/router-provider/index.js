import React, { useEffect } from 'react'
import { useWeb3Context } from 'web3-react'
import { Router } from 'react-router'
import { ConnectedRouter } from 'connected-react-router'
import { history } from 'data/store'
import { Loading } from '@linkdrop/ui-kit'
import AppRouter from '../router'
import ErrorPage from 'components/pages/main/error-page'
import { Page } from 'components/pages'

export default function RouterProvider () {
  const context = useWeb3Context()

  useEffect(() => {
    context.setFirstValidConnector(['MetaMask', 'Infura'])
  }, [])

  if (!context.active && !context.error) {
    return <Loading />
  } else if (context.error) {
    console.log(`error: ${context.error.code} (line: ${context.error.line}, col: ${context.error.column})`)
    return <Page>
      <ErrorPage
        error='NEED_METAMASK'
      />
    </Page>
  } else {
    return <ConnectedRouter history={history}>
      <Router history={history}>
        <AppRouter web3Provider={context.library._web3Provider} context={context} />
      </Router>
    </ConnectedRouter>
  }
}
