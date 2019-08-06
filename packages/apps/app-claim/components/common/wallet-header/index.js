import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import { Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import Menu from './menu'
import Footer from './footer'
import { Scrollbars } from 'react-custom-scrollbars'

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
        <div className={styles.headerIcon} onClick={_ => this.setState({
          opened: !opened
        })}>
          <Icons.About />
        </div>
        {this.t('titles.wallet')}
      </div>
      <div className={styles.body}>
        <div className={styles.bodyHeader}>
          <div className={styles.headerIcon} onClick={_ => this.setState({
            opened: !opened
          })}>
            <Icons.Cross />
          </div>
          {this.t('titles.about')}
        </div>
        <div className={styles.bodyMain}>
          <Scrollbars style={{
            heigth: '100%',
            width: '100%'
          }}>
            <div className={styles.bodyContent}>
              <div className={styles.title}>{this.t('titles.hey')}</div>
              <div className={styles.text}>{this.t('texts.intro')}</div>
            </div>
            <Menu />
            <Footer />
          </Scrollbars>
        </div>
      </div>
    </div>
  }
}

export default WalletHeader
