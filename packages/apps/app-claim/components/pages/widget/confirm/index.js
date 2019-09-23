import React from 'react'
import { DappHeader, AssetBalance } from 'components/common'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { utils } from 'ethers'

@actions(({ widget: { txParams }, user: { chainId }, assets: { itemsToClaim } }) => ({ txParams, itemsToClaim, chainId }))
@translate('pages.dappConfirm')
class DappConfirm extends React.Component {
  componentDidUpdate (prevProps) {
    const { txParams } = prevProps
    if (txParams && txParams.value === this.props.txParams.value) return null
    this._getEthCost()
  }

  componentDidMount () {
    this._getEthCost()
  }

  _getEthCost () {
    const { chainId, txParams } = this.props
    // just pass these variables as post message data
    const amount = utils.bigNumberify(txParams.value || '0').toString()
    this.actions().assets.getEthData({ chainId, weiAmount: amount })
  }

  async _onConfirmTx () {
    this.actions().widget.confirmTx()
  }

  render () {
    // dont pay much attention to the name of variable itemsToClaim, I will change it soon
    const { itemsToClaim } = this.props
    const currentAsset = itemsToClaim[itemsToClaim.length - 1] // hack to update values as action adds new assets in array on view update
    return <div className={styles.container}>
      <DappHeader
        title={this.t('titles.wallet')}
      />
      <div className={styles.content}>
        <div
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: this.t('titles.confirmAction', { dappName: 'Swap Tokens' }) }}
        />
        {this.renderAsset({ currentAsset })}

        <div className={styles.controls}>
          <Button
            inverted
            onClick={() => this.actions().widget.close()}
            className={styles.buttonCancel}
          >
            {this.t('buttons.cancel')}
          </Button>
          <Button
            className={styles.buttonConfirm}
            onClick={this._onConfirmTx.bind(this)}
          >
            {this.t('buttons.confirm')}
          </Button>
        </div>
      </div>
      <div
        className={styles.footer}
        dangerouslySetInnerHTML={{ __html: this.t('texts.dapp', { href: 'https://www.notion.so/linkdrop/Help-Center-9cf549af5f614e1caee6a660a93c489b#d0a28202100d4512bbeb52445e6db95b' }) }}
      />
    </div>
  }

  renderAsset ({ currentAsset }) {
    if (currentAsset) {
      return <div className={styles.assets}>
        <div className={styles.subtitle}>{this.t('titles.spend')}</div>
        <AssetBalance
          {...currentAsset}
          amount={currentAsset.balanceFormatted}
        />
      </div>
    }
    return null
  }
}

export default DappConfirm
