import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import classNames from 'classnames'
import { utils } from 'ethers'

@translate('common.assetBalance')
class AssetBalance extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      iconType: 'default'
    }
  }

  render () {
    const { iconType } = this.state
    const { loading, symbol, amount, decimals, icon, tokenAddress } = this.props
    const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.iconImg} src={icon} /> : <span />
    return <div className={classNames(styles.container, { [styles.loading]: loading })}>
      <div className={styles.icon}>
        {finalIcon}
      </div>
      <div className={styles.symbol}>{symbol}</div>
      <div className={styles.amount}>{utils.formatUnits(String(amount), String(decimals))}</div>/
      <div className={styles.price}>$66.6</div>
    </div>
  }
}

export default AssetBalance
