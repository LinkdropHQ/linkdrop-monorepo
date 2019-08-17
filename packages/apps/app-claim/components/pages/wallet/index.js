import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import { Icons } from '@linkdrop/ui-kit'
import { AssetBalance, AccountBalance } from 'components/common'
import classNames from 'classnames'

@actions(({ assets: { items } }) => ({ items }))
@translate('pages.wallet')
class Wallet extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expandAssets: false
    }
  }

  render () {
    const { expandAssets } = this.state
    const { items } = this.props
    const finalPrice = items.reduce((sum, item) => {
      sum = sum + (Number(item.balanceFormatted) * Number(item.price))
      return sum
    }, 0)
    return <Page dynamicHeader>
      <div className={styles.container}>
        <AccountBalance balance={finalPrice} />
        <div className={classNames(styles.assets, { [styles.assetsExpanded]: expandAssets })}>
          <div className={styles.assetsHeader} onClick={_ => this.setState({ expandAssets: !expandAssets })}>
            {this.t('titles.digitalAssets')}
            <Icons.PolygonArrow fill='#000' />
          </div>
          <div className={styles.assetsContent}>
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
    </Page>
  }
}

export default Wallet
