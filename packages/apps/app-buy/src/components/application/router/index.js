import React from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { Main, LinkGenerate, LoadingScreen, NotFound } from 'components/pages'
import MobileClaimPage from 'components/pages/link-generate/finished/mobile-claim'
import './styles'
import { history } from 'data/store'
import { getHashVariables } from '@linkdrop/commons'

class AppRouter extends React.Component {
  
  render () {
    const { link } = getHashVariables()
    return <ConnectedRouter history={history}>
      <HashRouter history={history}>
        <Switch>
          <Route path='/link-generate' component={LinkGenerate} />
          <Route path='/loading' component={LoadingScreen} />
          <Route path='/:application' component={this.defineMainPage({ link })} />
          <Route path='*' component={NotFound} />
        </Switch>
      </HashRouter>
    </ConnectedRouter>
  }

  defineMainPage ({ link }) {
    if (link) { return MobileClaimPage }
    return Main
  }
}

export default AppRouter
