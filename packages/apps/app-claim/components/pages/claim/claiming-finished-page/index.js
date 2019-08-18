import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { TokensAmount, AssetBalance, AccountBalance } from 'components/common'
import dapps from 'dapps'
import classNames from 'classnames'
import { getHashVariables } from '@linkdrop/commons'
import { Button, Icons, Loading } from '@linkdrop/ui-kit'
import { getCurrentAsset } from 'helpers'

@actions(({ assets: { items, itemsToClaim } }) => ({ items }))
@translate('pages.claim')
class ClaimingFinishedPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showAssets: false,
      expandAssets: false
    }
  }

  componentDidMount () {
    window.setTimeout(_ => this.setState({ showAssets: true }), 3000)
  }

  render () {
    const { items, itemsToClaim, alreadyClaimed, loading } = this.props
    const { showAssets, expandAssets } = this.state
    const finalPrice = items.reduce((sum, item) => {
      sum = sum + (Number(item.balanceFormatted) * Number(item.price))
      return sum
    }, 0)
    const mainAsset = getCurrentAsset({ itemsToClaim })
    if (!mainAsset) { return null }
    const { balanceFormatted, symbol } = mainAsset
    return <div className={commonStyles.container}>
      {loading && <Loading withOverlay />}
      <AccountBalance balance={finalPrice} />
      {!showAssets && <TokensAmount alreadyClaimed={alreadyClaimed} symbol={symbol} amount={balanceFormatted} />}
      {showAssets && this.renderAllAssets({ items, expandAssets })}
      {this.renderDappButton()}
    </div>
  }

  renderDappButton () {
    const {
      dappId
    } = getHashVariables()
    if (!dappId) { return null }
    const dapp = dapps[dappId]
    if (!dapp) { return null }
    const { label, url } = dapp
    return <Button href={url} target='_blank'>{this.t('buttons.goTo', { title: label })}</Button>
  }

  renderAllAssets ({ items, expandAssets }) {
    return <div className={classNames(styles.assets, { [styles.assetsExpanded]: expandAssets })}>
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
  }
}

export default ClaimingFinishedPage
