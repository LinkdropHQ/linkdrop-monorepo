import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'
import { convertFromExponents } from '@linkdrop/commons'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class LinkContents extends React.Component {
  render () {
    const { ethAmount, tokenAmount, tokenSymbol } = this.props
    if (ethAmount && !tokenAmount && tokenSymbol === 'ETH') {
      return <p className={styles.dataContent}>
        {this.t('titles.oneLinkContents', { tokenAmount: convertFromExponents(ethAmount), tokenSymbol })}
      </p>
    }
    if (!ethAmount || Number(ethAmount) === 0) {
      return <p className={styles.dataContent}>
        {this.t('titles.oneLinkContents', { tokenAmount: convertFromExponents(tokenAmount), tokenSymbol })}
      </p>
    }
    return <p className={styles.dataContent}>
      {this.t('titles.oneLinkContentsWithEth', { tokenAmount: convertFromExponents(tokenAmount), tokenSymbol, ethAmount: convertFromExponents(ethAmount) })}
    </p>
  }
}

export default LinkContents
