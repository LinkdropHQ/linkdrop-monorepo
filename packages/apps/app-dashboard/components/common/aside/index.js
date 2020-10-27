import React from 'react'
import { actions, translate } from 'decorators'
import { Button } from 'components/common'
import styles from './styles.module'
import { RetinaImage } from '@linkdrop/ui-kit'
import { getImages } from 'helpers'
import classNames from 'classnames'
import { withRouter } from 'react-router'
import { defineNetworkName, capitalize } from '@linkdrop/commons'

@actions(({
  user: {
    currentAddress,
    chainId,
    web3ProviderName
  },
  campaigns: {
    items
  }
}) => ({
  currentAddress,
  items,
  chainId,
  web3ProviderName
}))
@translate('common.aside')
class Aside extends React.Component {
  render () {
    const { currentAddress, items, chainId, web3ProviderName } = this.props
    
    return <aside className={styles.container}>
      <div className={styles.mainBlock}>
        <div className={styles.logo}>
          <a href='/#/'>
            <RetinaImage alwaysHighRes width={115} {...getImages({ src: 'logo' })} />
          </a>
        </div>
        {this.renderNetworkName({ chainId })}
        {this.renderDashboardButton()}
        {this.renderCampaignsButton({ currentAddress, items, chainId })}
        {this.renderAnalyticsButton()}
        {this.renderSettingsButton()}
      </div>
      <div className={styles.footer}>
        {this.renderConnectorData({ web3ProviderName, currentAddress })}
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

  renderNetworkName ({ chainId }) {
    const netWorkName = defineNetworkName({ chainId })
    if (!chainId) { return null }
    if (!netWorkName) { return null }
    if (netWorkName === '') { return null }
    const title = netWorkName === 'xdai' ? 'xDAI' : capitalize({ string: netWorkName })
    return <div className={classNames(styles.networkName, {
      [styles.networkNameMain]: netWorkName === 'xdai' || netWorkName === 'mainnet'
    })}>
      {title}
    </div>
  }

  renderConnectorData ({ web3ProviderName, currentAddress }) {
    if (!currentAddress) {
      return <div className={styles.connectorData}>
        <div className={styles.indicator}/>
        Not connected
      </div>
    }
    const currentAddressFormatted = `${(currentAddress || '').slice(0, 9)}...${(currentAddress || '').slice(-8)}`
    return <div className={styles.connectorData}>
      <div className={classNames(styles.indicator, {
        [styles.active]: currentAddress.length > 0
      })}
      />
      <span>{web3ProviderName}</span> connected
      <div>{currentAddressFormatted}</div>
      <div className={styles.logout} onClick={_ => window.location.reload()}>
        {this.t('logout')}
      </div>
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
    })}
    >
      <a
        onClick={e => {
          if (!currentAddress || itemsForCurrentChainId.length === 0) { e.preventDefault() }
        }} href='/#/campaigns'
      >{this.t('campaigns')}
      </a>
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
