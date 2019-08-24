import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import classNames from 'classnames'
import { multiply, bignumber } from 'mathjs'

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
    const { loading, symbol, amount, onClick, icon, tokenAddress, price, className } = this.props
    const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.iconImg} src={icon} /> : <span />
    const finalPrice = String(multiply(bignumber(price), bignumber(amount)))
    return <div onClick={_ => onClick && onClick()} className={classNames(styles.container, className, { [styles.loading]: loading })}>
      <div className={styles.icon}>
        {finalIcon}
      </div>
      <div className={styles.symbol}>{symbol}</div>
      <div className={styles.amount}>{(Number(amount) || 0).toFixed(2)}</div>
      <span className={styles.divider}>/</span>
      <div className={styles.price}>${(Number(finalPrice) || 0).toFixed(2)}</div>
    </div>
  }
}

export default AssetBalance
