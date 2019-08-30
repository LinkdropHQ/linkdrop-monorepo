import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import { Icons, Loading, Button } from '@linkdrop/ui-kit'
import { AssetBalance, AccountBalance } from 'components/common'
import classNames from 'classnames'
import { countFinalPrice } from 'helpers'
import { getHashVariables, defineNetworkName } from '@linkdrop/commons'
import { ControlTabs } from 'components/pages/common'
import dapps from 'dapps'

@actions(({ user: { loading, contractAddress, ens }, assets: { items } }) => ({ items, loading, contractAddress, ens }))
@translate('pages.wallet')
class Wallet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expandAssets: false
    }
  }

  renderDappButton () {
    const {
      dappId
    } = getHashVariables()
    if (!dappId) { return null }
    const dapp = dapps[dappId]
    if (!dapp) { return null }
    const { label, url } = dapp
    const { ens } = this.props
    const { chainId } = getHashVariables()
    const network = defineNetworkName({ chainId })
    const confirmUrl = encodeURIComponent(`${window.origin}/#/confirm`)
    const dappUrl = `${url}?user=${ens}&network=${network}&confirmUrl=${confirmUrl}`
    return <Button className={styles.button} inverted href={dappUrl} target='_blank'>{this.t('buttons.goTo', { title: label })}</Button>
  }

  render () {
    const { expandAssets } = this.state
    const { items, loading } = this.props
    const finalPrice = countFinalPrice({ items })
    return <Page dynamicHeader>
      <div className={styles.container}>
        {loading && <Loading withOverlay />}
        <AccountBalance balance={finalPrice} />
        <div className={classNames(styles.assets, { [styles.assetsExpanded]: expandAssets })}>
          <div className={styles.assetsHeader} onClick={_ => this.setState({ expandAssets: !expandAssets })}>
            {this.t('titles.digitalAssets')}
            <Icons.PolygonArrow fill='#000' />
          </div>
          <div className={styles.assetsContent}>
            <div className={styles.assetsContentItems}>
              {items.map(({
                icon,
                symbol,
                balanceFormatted,
                tokenAddress,
                price
              }) => <AssetBalance
                key={tokenAddress}
                symbol={symbol}
                amount={balanceFormatted}
                price={price}
                icon={icon}
              />)}
            </div>
            <ControlTabs />
            {this.renderDappButton()}
          </div>
        </div>
      </div>
    </Page>
  }
}

export default Wallet
