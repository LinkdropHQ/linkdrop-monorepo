import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'
import { convertFromExponents } from '@linkdrop/commons'
import { multiply, bignumber } from 'mathjs'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class EthAmountData extends React.Component {
  render () {
    const { ethAmount, linksAmount } = this.props
    if (!ethAmount || Number(ethAmount) === 0) { return null }
    return <div className={styles.data}>
      <h3 className={styles.dataTitle}>
        {this.t('titles.totalEthInLinks')}
      </h3>
      <div className={styles.dataContent}>
        {convertFromExponents(multiply(bignumber(ethAmount), bignumber(linksAmount)))} ETH
      </div>
      <div className={styles.extraDataContent}>
        {this.t('titles.ethHold')}
      </div>
    </div>
  }
}

export default EthAmountData
