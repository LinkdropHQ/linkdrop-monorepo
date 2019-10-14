import React from 'react'
import { actions, translate } from 'decorators'
import styles from '../styles.module'
import { convertFromExponents } from '@linkdrop/commons'
import { defineDefaultSymbol } from 'helpers'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('pages.campaignCreate')
class LinkContents extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
  }

  render () {
    const { ethAmount, tokenAmount, tokenSymbol } = this.props
    if (ethAmount && !tokenAmount && tokenSymbol === this.defaultSymbol) {
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
      {this.t('titles.oneLinkContentsWithEth', { symbol: this.defaultSymbol, tokenAmount: convertFromExponents(tokenAmount), tokenSymbol, ethAmount: convertFromExponents(ethAmount) })}
    </p>
  }
}

export default LinkContents
