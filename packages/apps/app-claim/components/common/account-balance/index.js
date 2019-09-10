import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'
import classNames from 'classnames'
import { translate } from 'decorators'
import { countFinalPrice } from 'helpers'

@translate('common.accountBalance')
class AccountBalance extends React.Component {
  render () {
    const { loading, items } = this.props
    const finalPrice = countFinalPrice({ items })

    return null
    return <div className={classNames(styles.container, {
      [styles.loading]: loading
    })}
    >
      <span className={styles.currency}>$</span>
      <span className={styles.balance}>{(balance || 0).toFixed(2)}</span>
    </div>
  }
}

AccountBalance.propTypes = {
  balance: PropTypes.number.isRequired,
  loading: PropTypes.boolean
}

export default AccountBalance
