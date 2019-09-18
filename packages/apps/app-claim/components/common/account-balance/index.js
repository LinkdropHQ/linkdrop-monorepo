import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'
import classNames from 'classnames'
import { translate } from 'decorators'
import { countFinalPrice, roundAmount } from 'helpers'
import { ethers } from 'ethers'

@translate('common.accountBalance')
class AccountBalance extends React.Component {
  render () {
    const { loading, items } = this.props
    const finalPrice = countFinalPrice({ items })
    const coreAsset = this.defineCoreAsset({ items })
    const currency = this.renderCurrency({ loading, coreAsset, finalPrice })
    const balance = this.renderBalance({ loading, coreAsset, finalPrice })
    return <div className={classNames(styles.container, {
      [styles.loading]: loading || items === null
    })}
    >
      <span className={styles.currency}>{currency}</span>
      <span className={styles.balance}>{roundAmount({ amount: balance, hideFloat: true, roundTo: 100 })}</span>
    </div>
  }

  defineCoreAsset ({ items }) {
    if (!items) return null
    const eth = items.find(item => item.tokenAddress === ethers.constants.AddressZero)
    if (eth) { return eth }
    const assetWithPrice = items.find(item => item.price > 0)
    if (assetWithPrice) { return assetWithPrice }
    if (items[0]) { return items[0] }
  }

  renderCurrency ({ loading, coreAsset, finalPrice }) {
    if ((finalPrice && finalPrice > 0) || loading || !coreAsset) return '$'
    return <img src={coreAsset.icon} />
  }

  renderBalance ({ loading, coreAsset, finalPrice }) {
    if (loading || !coreAsset) return 0
    if (finalPrice != null && Number(finalPrice.toFixed(2)) > 0) {
      return finalPrice
    }
    if (coreAsset && Number(coreAsset.balanceFormatted) > 0) {
      return coreAsset.balanceFormatted
    }
    return 0
  }
}

// AccountBalance.propTypes = {
//   balance: PropTypes.number.isRequired,
//   loading: PropTypes.boolean
// }

export default AccountBalance
