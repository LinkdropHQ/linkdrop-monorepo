import React from 'react'
import i18next from 'i18next'
import { Route, Switch } from 'react-router-dom'
import { Claim, NotFound, Wallet, Confirm, Send, Receive, BuyTokens } from 'components/pages'
import './styles'
import { getHashVariables } from '@linkdrop/commons'
import config from 'app.config.js'

import { actions } from 'decorators'
@actions(({ user: { sdk, loading, loacale } }) => ({
  sdk,
  loading,
  loacale
}))
class AppRouter extends React.Component {
  componentWillReceiveProps ({ locale }) {
    const { locale: prevLocale } = this.props
    if (locale === prevLocale) { return }
    i18next.changeLanguage(locale)
  }

  componentDidMount () {
    const { sdk } = this.props
    if (!sdk) {
      const {
        chainId = config.defaultChainId
      } = getHashVariables()
      this.actions().user.createSdk({ chainId })
    }
  }

  render () {
    return <Switch>
      <Route path='/receive' component={Claim} />
      <Route path='/confirm' component={Confirm} />
      <Route path='/get' component={Receive} />
      <Route path='/send' component={Send} />
      <Route path='/buy-tokens' component={BuyTokens} />
      <Route path='/' component={Wallet} />
      <Route path='*' component={NotFound} />
    </Switch>
  }
}

export default AppRouter
