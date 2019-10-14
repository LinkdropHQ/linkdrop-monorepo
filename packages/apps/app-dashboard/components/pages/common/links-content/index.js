import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { convertFromExponents } from '@linkdrop/commons'
import { defineDefaultSymbol } from 'helpers'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('pages.campaignCreate')
class LinksContent extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
  }

  render () {
    const { tokenType, ethAmount, tokenSymbol, tokenAmount } = this.props
    if (tokenType === 'eth') {
      return <p className={classNames(styles.text, styles.textMargin30)}>
        {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContents', { tokenAmount: convertFromExponents(ethAmount), tokenSymbol: this.defaultSymbol })}`}
      </p>
    }
    if ((tokenType === 'erc20' || tokenType === 'erc721') && ethAmount) {
      return <p className={classNames(styles.text, styles.textMargin30)}>
        {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContentsWithEth', { symbol: this.defaultSymbol, tokenAmount: convertFromExponents(tokenAmount), tokenSymbol, ethAmount: convertFromExponents(ethAmount) })}`}
      </p>
    }

    if (tokenType === 'erc721') {
      return <p className={classNames(styles.text, styles.textMargin30)}>
        {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContents', { tokenAmount, tokenSymbol })}`}
      </p>
    }

    return <p className={classNames(styles.text, styles.textMargin30)}>
      {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContents', { tokenAmount: convertFromExponents(tokenAmount), tokenSymbol })}`}
    </p>
  }
}

export default LinksContent
