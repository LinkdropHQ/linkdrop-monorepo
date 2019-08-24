import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Input, Button, Icons } from '@linkdrop/ui-kit'

@actions(({ user: { loading, contractAddress }, assets: { items } }) => ({ items, loading, contractAddress }))
@translate('pages.send')
class Header extends React.Component {
  render () {
    return <div className={styles.container}>
      <div className={styles.close}>
        <Icons.Cross />
      </div>
      <div className={styles.amount} />
      <div className={styles.input}>
        <Input />
      </div>
      <div className={styles.controls}>
        <Button className={styles.button}>{this.t('buttons.pay')}</Button>
      </div>
    </div>
  }
}

export default Header
