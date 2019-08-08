import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import { AssetBalance, AccountBalance } from 'components/common'

@actions(({ assets: { items } }) => ({ items }))
@translate('pages.main')
class Wallet extends React.Component {
  render () {
    const { items } = this.props
    const finalPrice = items.reduce((sum, item) => {
      sum = sum + (Number(item.balanceFormatted) * Number(item.price))
      return sum
    }, 0)
    return <Page dynamicHeader>
      <div className={styles.container}>
        <AccountBalance balance={finalPrice} />
        {items.map(({
          icon,
          symbol,
          balanceFormatted,
          tokenAddress,
          price
        }) => <AssetBalance
          key={tokenAddress}
          loading={loading}
          symbol={symbol}
          amount={balanceFormatted}
          price={price}
          icon={icon}
        />)}
      </div>
    </Page>
  }
}

export default Wallet
