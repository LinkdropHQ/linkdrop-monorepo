import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import { RetinaImage } from '@linkdrop/ui-kit'
import { getImages } from 'helpers'
import classNames from 'classnames'
import { withRouter } from 'react-router'

@actions(({ user: { currentAddress, chainId }, campaigns: { items } }) => ({ currentAddress, items, chainId }))
@translate('common.aside')
class Aside extends React.Component {
  render () {
    const { currentAddress, items, chainId } = this.props
    return <aside className={styles.container}>
      <div className={styles.mainBlock}>
        <div className={styles.logo}>
          <a href='/#/'><RetinaImage alwaysHighRes width={181} {...getImages({ src: 'logo' })} /></a>
        </div>
        {this.renderDashboardButton()}
        {this.renderCampaignsButton({ currentAddress, items, chainId })}
        {this.renderAnalyticsButton()}
        {this.renderSettingsButton()}
        {this.renderCreateButton({ currentAddress })}
      </div>
      <div className={styles.footer}>
        <div className={styles.footerMenu}>
          <a target='_blank' href='https://www.notion.so/Terms-and-Privacy-dfa7d9b85698491d9926cbfe3c9a0a58' className={styles.link}>{this.t('legal')}</a>
          <a target='_blank' href='https://linkdrop.io/contact' className={styles.link}>{this.t('contactUs')}</a>
        </div>
        <div className={styles.copyright}>
          {this.t('copyright')}
        </div>
      </div>
    </aside>
  }

  renderCreateButton ({ currentAddress }) {
    return <div className={styles.buttonContainer}>
      <Button
        className={classNames(styles.button, { [styles.buttonDisabled]: !currentAddress })}
        onClick={_ => {
          if (!currentAddress) { return }
          const { privateKey } = this.props
          if (privateKey) {
            this.actions().user.setStep({ step: 2 })
          } else {
            this.actions().user.setStep({ step: 1 })
          }
          window.location.href = '/#/campaigns/create'
        }}
        disabled={!currentAddress}
      >
        {this.t('create')}
      </Button>
    </div>
  }

  renderDashboardButton () {
    return <div className={classNames(styles.menuItem, { [styles.active]: this.defineCurrentPage() === 'dashboard' })}>
      <a href='/#/'>{this.t('dashboard')}</a>
    </div>
  }

  renderCampaignsButton ({ currentAddress, items, chainId }) {
    const itemsForCurrentChainId = items.filter(item => item.chainId === chainId && item.currentAddress === currentAddress)
    return <div className={classNames(styles.menuItem, {
      [styles.disabled]: !currentAddress || !itemsForCurrentChainId || itemsForCurrentChainId.length === 0,
      [styles.active]: this.defineCurrentPage() === 'campaigns'
    })}>
      <a onClick={e => {
        if (!currentAddress || itemsForCurrentChainId.length === 0) { e.preventDefault() }
      }} href='/#/campaigns'>{this.t('campaigns')}</a>
    </div>
  }

  renderAnalyticsButton () {
    return <div className={classNames(styles.menuItem, styles.disabled)}>
      <a>{this.t('analytics')}</a><span className={styles.soon}>{this.t('soon')}</span>
    </div>
  }

  renderSettingsButton () {
    return <div className={classNames(styles.menuItem, styles.disabled)}>
      <a>{this.t('settings')}</a>
    </div>
  }

  defineCurrentPage () {
    const { location: { pathname } } = this.props
    if (pathname === '/campaigns') { return 'campaigns' }
    if (pathname === '/') { return 'dashboard' }
    return null
  }
}

export default withRouter(Aside)
