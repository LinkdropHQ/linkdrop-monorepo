import React from 'react'
import { Route, Switch, HashRouter } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { Main } from 'components/pages'
import './styles'
import { history } from 'data/store'

// import { actions } from 'decorators'
// @actions(({ user: { sdk, privateKey, loading, loacale } }) => ({
//   sdk,
//   loading,
//   loacale,
//   privateKey
// }))
class AppRouter extends React.Component {
  render () {
    return <ConnectedRouter history={history}>
      <HashRouter history={history}>
        <Switch>
          <Route path='/' component={Main} />
        </Switch>
      </HashRouter>
    </ConnectedRouter>
  }
}

export default AppRouter
