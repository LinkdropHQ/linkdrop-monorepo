import React from 'react'
import { Header } from '@linkdrop/ui-kit'
import { WalletHeader, MoonpayWidget, Note } from 'components/common'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import classNames from 'classnames'

@actions(({ user: { showNote, chainId, moonpayShow, contractAddress } }) => ({ chainId, showNote, moonpayShow, contractAddress }))
@translate('pages.page')
class Page extends React.Component {
  componentDidMount () {
    const { contractAddress, chainId } = this.props

    const interval = window.checkAssets
    if (interval) {
      interval && window.clearInterval(interval)
    }
    if (!contractAddress) { return }
    this.actions().assets.getItems({ chainId, wallet: contractAddress })
    window.checkAssets = window.setInterval(_ => this.actions().assets.getItems({ chainId, wallet: contractAddress }), 30000)
  }

  render () {
    const { showNote, dynamicHeader, moonpayShow, children, hideHeader, disableProfile, note } = this.props
    return <div className={classNames(styles.container, {
      [styles.hideHeader]: hideHeader
    })}
    >
      {this.renderHeader({ hideHeader, dynamicHeader, disableProfile })}
      {note && showNote && <div className={styles.note}>
        <Note
          title={note}
          onClose={_ => this.actions().user.toggleNote({ showNote: false })}
        />
      </div>}
      <div
        className={styles.main}
        style={{ height: note && showNote ? 'calc(100vh - 122px)' : 'calc(100vh - 90px)' }}
      >
        {children}
      </div>
      {moonpayShow && <MoonpayWidget onClose={_ => this.actions().user.setMoonpayShow({ moonpayShow: false })} />}
    </div>
  }

  renderHeader ({ hideHeader, dynamicHeader, disableProfile }) {
    if (hideHeader) { return null }
    if (dynamicHeader) { return <WalletHeader disableProfile={disableProfile} /> }
    return <Header title={this.t('titles.getTokens')} />
  }
}

export default Page
