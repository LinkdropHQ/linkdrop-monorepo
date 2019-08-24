import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import Header from './header'
import Item from './item'

@actions(({ user: { loading, contractAddress }, assets: { items } }) => ({ items, loading, contractAddress }))
@translate('pages.send')
class Contacts extends React.Component {
  render () {
    return <div className={styles.container}>
      <Header title={this.t('titles.contacts')} />
      <div className={styles.content}>
        <Item name='Haz Baikulov' email='spacehaz@gmail.com' />
      </div>
    </div>
  }
}

export default Contacts
