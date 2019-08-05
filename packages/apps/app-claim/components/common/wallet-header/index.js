import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import { Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import Menu from './menu'

@translate('common.walletHeader')
class WalletHeader extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      opened: false
    }
  }

  render () {
    const { opened } = this.state
    return <div className={classNames(styles.container, {
      [styles.opened]: opened
    })}>
      <div className={styles.header}>
        <div className={styles.headerIcon}>
          <Icons.About />
        </div>
        {this.t('titles.wallet')}
      </div>
      <div className={styles.body}>
        <div className={styles.bodyHeader}>
          <Icons.Close />{this.t('titles.about')}
        </div>
        <div className={styles.bodyContent}>
          <div className={styles.title}>{this.t('titles.hey')}</div>
          <div className={styles.title}>{this.t('texts.congrats')}</div>
        </div>
        <Menu items={[{ title: 'hello' }]} />
      </div>
    </div>
  }
}

export default WalletHeader
