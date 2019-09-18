import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import { Note } from 'components/common'
import Menu from './menu'
import Footer from './footer'
import Name from './name'
import { Scrollbars } from 'react-custom-scrollbars'
import variables from 'variables'
import { prepareRedirectUrl } from 'helpers'

@actions(({ user: { ens, avatar, chainId } }) => ({ chainId, ens, avatar }))
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
    const { avatar, ens, chainId, disableProfile } = this.props

    return <div className={classNames(styles.container, {
      [styles.opened]: opened
    })}
    >
      <div className={styles.header}>
        {!disableProfile && <div
          className={styles.headerIcon} onClick={_ => this.setState({
            opened: !opened
          })}
        >
          {this.renderProfileIcon({ avatar })}
        </div>}
        <a href={prepareRedirectUrl({ link: '/#/' })}>{this.t('titles.wallet')}</a>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyHeader}>
          <div className={styles.bodyHeaderQrIcon} onClick={_ => { window.location.href = prepareRedirectUrl({ link: '/#/get' }) }}>
            <Icons.Qr />
          </div>
          <div
            className={styles.bodyHeaderCloseIcon} onClick={_ => this.setState({
              opened: !opened
            })}
          >
            <Icons.CloseArrow />
          </div>
        </div>
        <div className={styles.bodyMain}>
          <Scrollbars style={{
            height: '100vh',
            width: '100%'
          }}
          >
            <div className={styles.bodyContent}>
              {this.renderAvatar({ avatar })}
              {this.renderName({ ens, chainId })}
              <Note title='⚠ T️his wallet is for testing only. Use at your own risk' />
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
      return <div className={classNames(styles.avatar, styles.avatarDefault)}>
        <Icons.Profile fill={variables.avatarDisabled} width={80} height={80} />
      </div>
    }
    return <div className={styles.avatar} style={{ backgroundImage: `url(${avatar})` }} />
  }

  renderProfileIcon ({ avatar }) {
    if (!avatar || avatar === 'undefined') {
      return <Icons.Profile />
    }
    return <div
      className={classNames(styles.avatar, styles.avatarSmall)}
      style={{ backgroundImage: `url(${avatar})` }}
    />
  }

  renderName ({ ens, chainId }) {
    if (ens) { return <Name ens={ens} chainId={chainId} /> }
  }
}

export default WalletHeader
