import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { convertFromExponents } from '@linkdrop/commons'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class LinksContent extends React.Component {
  render () {
    const { tokenType, ethAmount, tokenSymbol, tokenAmount } = this.props
    if (tokenType === 'eth') {
      return <p className={classNames(styles.text, styles.textMargin30)}>
        {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContents', { tokenAmount: convertFromExponents(ethAmount), tokenSymbol: 'ETH' })}`}
      </p>
    }
    if (tokenType === 'erc20' && ethAmount) {
      return <p className={classNames(styles.text, styles.textMargin30)}>
        {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContentsWithEth', { tokenAmount: convertFromExponents(tokenAmount), tokenSymbol, ethAmount: convertFromExponents(ethAmount) })}`}
      </p>
    }
    return <p className={classNames(styles.text, styles.textMargin30)}>
      {`${this.t('titles.oneLinkContains')} ${this.t('titles.oneLinkContents', { tokenAmount: convertFromExponents(tokenAmount), tokenSymbol })}`}
    </p>
  }
}

export default LinksContent
