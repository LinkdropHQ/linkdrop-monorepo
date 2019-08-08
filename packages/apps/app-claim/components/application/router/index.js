import React from 'react'
import i18next from 'i18next'
import { Route, Switch } from 'react-router-dom'
import { Main, NotFound, Wallet } from 'components/pages'
import './styles'

import { actions } from 'decorators'
@actions(({ user }) => ({
  locale: (user || {}).locale
}))
class AppRouter extends React.Component {
  componentWillReceiveProps ({ locale }) {
    const { locale: prevLocale } = this.props
    if (locale === prevLocale) { return }
    i18next.changeLanguage(locale)
  }

  componentDidMount () {}

  render () {
    return <Switch>
      <Route path='/receive' component={Main} />
      <Route path='/' component={Wallet} />
      <Route path='*' component={NotFound} />
    </Switch>
  }
}

export default AppRouter
