import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { convertFromExponents } from '@linkdrop/commons'
import { multiply, bignumber } from 'mathjs'
import { defineDefaultSymbol } from 'helpers'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('pages.campaignCreate')
class EthTexts extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
  }

  render () {
    const { ethAmount, linksAmount, chainId } = this.props
    if (!ethAmount || Number(ethAmount) === 0) { return null }
    return <div>
      <p className={styles.text}>{this.t('titles.ethInLinks', { symbol: this.defaultSymbol, ethAmount: convertFromExponents(Number(multiply(bignumber(ethAmount), bignumber(linksAmount)))), linksAmount })}</p>
      <p className={classNames(styles.text, styles.textGrey, styles.textMargin30)}>{this.t('titles.holdEth', { symbol: this.defaultSymbol })}</p>
    </div>
  }
}

export default EthTexts
