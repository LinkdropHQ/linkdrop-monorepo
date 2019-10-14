import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { multiply, add, bignumber } from 'mathjs'
import classNames from 'classnames'
import { convertFromExponents } from '@linkdrop/commons'
import { defineDefaultSymbol } from 'helpers'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('pages.campaignCreate')
class ApproveSummary extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
  }

  render () {
    const { serviceFee, linksAmount, ethAmount, tokenAmount, tokenSymbol, tokenType } = this.props
    const ethAmountFinal = multiply(add(bignumber(ethAmount), bignumber(serviceFee)), bignumber(linksAmount))
    const onlyServiceFee = multiply(bignumber(serviceFee), bignumber(linksAmount))
    const onlyEthForLinks = multiply(bignumber(ethAmount), bignumber(linksAmount))
    if (tokenType === 'erc20') {
      return <div className={classNames(styles.container, styles.tokens)}>
        <div dangerouslySetInnerHTML={{ __html: this.t('titles.approveTokens', { tokenAmount: convertFromExponents(multiply(bignumber(tokenAmount), bignumber(linksAmount))), tokenSymbol }) }} />
      </div>
    }

    if (tokenType === 'erc721') {
      return <div className={classNames(styles.container, styles.tokens)}>
        <div dangerouslySetInnerHTML={{ __html: this.t('titles.approveTokens', { tokenAmount: linksAmount, tokenSymbol }) }} />
      </div>
    }
    return <div className={classNames(styles.container, styles.eth)}>
      <div dangerouslySetInnerHTML={{ __html: this.t('titles.sendEthToGenerate', { symbol: this.defaultSymbol, ethAmount: convertFromExponents(ethAmountFinal) }) }} />
      <div className={styles.contents}>
        <div className={styles.contentsItem} dangerouslySetInnerHTML={{ __html: this.t('titles.etherToDistribute', { symbol: this.defaultSymbol, ethAmount: convertFromExponents(onlyEthForLinks) }) }} />
        <div className={styles.contentsItem} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFeeToDistribute', { symbol: this.defaultSymbol, ethAmount: convertFromExponents(onlyServiceFee) }) }} />
      </div>
    </div>
  }
}

export default ApproveSummary
