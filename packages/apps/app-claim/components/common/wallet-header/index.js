import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import Menu from './menu'
import Footer from './footer'
import Name from './name'
import { Scrollbars } from 'react-custom-scrollbars'
import variables from 'variables'
import { prepareRedirectUrl } from 'helpers'

@actions(({ user: { ens, avatar } }) => ({ ens, avatar }))
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
    const { avatar, ens } = this.props

    return <div className={classNames(styles.container, {
      [styles.opened]: opened
    })}
    >
      <div className={styles.header}>
        <div
          className={styles.headerIcon} onClick={_ => this.setState({
            opened: !opened
          })}
        >
          <Icons.Profile />
        </div>
        <a href={prepareRedirectUrl({ link: '/#/' })}>{this.t('titles.wallet')}</a>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyHeader}>
          <div className={styles.bodyHeaderQrIcon} onClick={_ => { window.location.href = prepareRedirectUrl({ link: '/#/get' }) }}>
            <Icons.Qr />
          </div>
          {this.t('titles.about')}
          <div
            className={styles.bodyHeaderCloseIcon} onClick={_ => this.setState({
              opened: !opened
            })}
          >
            <Icons.Cross />
          </div>
        </div>
        <div className={styles.bodyMain}>
          <Scrollbars style={{
            height: 'calc(100vh - 90px)',
            width: '100%'
          }}
          >
            <div className={styles.bodyContent}>
              {this.renderAvatar({ avatar })}
              {this.renderName({ ens })}
            </div>
            <Menu />
            <Footer />
          </Scrollbars>
        </div>
      </div>
    </div>
  }

  renderAvatar ({ avatar }) {
    if (!avatar || avatar === 'undefined') {
      return <div className={styles.avatar}>
        <Icons.Profile fill={variables.avatarDisabled} width={80} height={80} />
      </div>
    }
    return <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }} />
  }

  renderName ({ ens }) {
    if (ens) { return <Name ens={ens} /> }
  }
}

export default WalletHeader
