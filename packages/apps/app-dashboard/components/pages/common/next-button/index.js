import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Button } from 'components/common'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class NextButton extends React.Component {
  render () {
    const { ethAmount = 0, wallet = 'trust', tokenIds, tokenSymbol, tokenAmount = 0, linksAmount = 0, tokenType } = this.props
    let action
    if (tokenType === 'eth') {
      action = _ => this.actions().campaigns.prepareNewEthData({ ethAmount, wallet, linksAmount, tokenSymbol, tokenType })
    } else if (tokenType === 'erc20') {
      action = _ => this.actions().campaigns.prepareNewERC20Data({ tokenAmount, wallet, ethAmount, linksAmount, tokenSymbol, tokenType })
    } else {
      action = _ => this.actions().campaigns.prepareNewERC721Data({ tokenAmount, wallet, tokenIds, ethAmount, tokenSymbol, tokenType })
    }
    return <div className={styles.controls}>
      <Button className={styles.button} disabled={this.defineIfButtonDisabled({ tokenType, ethAmount, tokenAmount, linksAmount })} onClick={action}>{this.t('buttons.next')}</Button>
    </div>
  }

  defineIfButtonDisabled ({ tokenType, ethAmount, tokenAmount, linksAmount }) {
    if (!Number(linksAmount)) { return true }
    if (tokenType === 'erc20') { return !Number(tokenAmount) }
    if (tokenType === 'eth') { return !Number(ethAmount) }
  }
}

export default NextButton
