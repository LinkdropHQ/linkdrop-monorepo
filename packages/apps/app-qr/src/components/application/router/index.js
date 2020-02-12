import React from 'react'
import i18next from 'i18next'
import { Route, Switch } from 'react-router-dom'
import { Main, Page, NotFound } from 'components/pages'
import './styles'

import { history } from 'data/store'
import { HashRouter } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'

import { actions } from 'decorators'
class AppRouter extends React.Component {
  render () {
    return <Page>
      <ConnectedRouter history={history}>
        <HashRouter history={history}>
          <Switch>
            <Route path='/' render={props => <Main />} />
          </Switch>
        </HashRouter>
      </ConnectedRouter>
    </Page>
  }
}

export default AppRouter
