import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import classNames from 'classnames'
import { roundAmount } from 'helpers'
import { multiply, bignumber } from 'mathjs'
import { Icons } from '@linkdrop/ui-kit'

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
    const finalIcon = iconType === 'default'
      ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.iconImg} src={icon} />
      : <Icons.Star width={30} height={30} />
    const finalPrice = String(multiply(bignumber(price), bignumber(amount)))
    return <div
      onClick={_ => onClick && onClick()} className={classNames(styles.container, className, {
        [styles.loading]: loading,
        [styles.eth]: symbol === 'ETH'
      })}
    >
      <div className={classNames(styles.icon, {
        [styles.iconBlank]: iconType === 'blank'
      })}
      >
        {finalIcon}
      </div>
      <div className={styles.symbol}>{symbol}</div>
      <div className={styles.amount}>{roundAmount({ amount })}</div>
      <span className={styles.divider}>/</span>
      <div className={styles.price}>${roundAmount({ amount: finalPrice, roundTo: 100 })}</div>
    </div>
  }
}

export default AssetBalance
