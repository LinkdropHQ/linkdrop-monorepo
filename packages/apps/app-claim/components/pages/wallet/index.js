/* global navigator */
import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import { Icons, Loading, Button } from '@linkdrop/ui-kit'
import { AssetBalance, AccountBalance } from 'components/common'
import classNames from 'classnames'
import { countFinalPrice } from 'helpers'
import { getHashVariables } from '@linkdrop/commons'

@actions(({ user: { loading, contractAddress }, assets: { items } }) => ({ items, loading, contractAddress }))
@translate('pages.wallet')
class Wallet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expandAssets: false
    }
  }

  componentDidMount () {
    const { items } = this.props
    const {
      chainId
    } = getHashVariables()
    if (!items || items.length === 0) {
      this.actions().assets.getItems({ chainId })
    }
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
          </div>
        </div>
      </div>
    </Page>
  }
}

export default Wallet
