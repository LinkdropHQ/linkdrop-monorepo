import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import Header from './header'
import Assets from './assets'
import Input from './input'
import Contacts from './contacts'
import { getHashVariables } from '@linkdrop/commons'

@actions(({ user: { loading, contractAddress }, assets: { items } }) => ({ items, loading, contractAddress }))
@translate('pages.send')
class Send extends React.Component {
  componentDidMount () {
    const { items } = this.props
    const {
      chainId
    } = getHashVariables()
    if (!items || items.length === 0) {
      this.actions().assets.getItems({ chainId })
    }
  }

  render () {
    return <Page>
      <div className={styles.container}>
        <Header />
        <Assets />
        <Input title={this.t('titles.to')} placeholder={this.t('titles.toPlaceholder')} />
        <Input title={this.t('titles.for')} placeholder={this.t('titles.forPlaceholder')} />
        <Contacts />
      </div>
    </Page>
  }
}

export default Send
