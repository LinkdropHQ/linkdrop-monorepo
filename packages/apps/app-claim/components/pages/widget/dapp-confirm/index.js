import React from 'react'
import { DappHeader, AssetBalance } from 'components/common'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { getHashVariables } from '@linkdrop/commons'
import { utils } from 'ethers'
import widgetService from 'data/api/widget'
import classNames from 'classnames'

@actions(({ user: { ens, contractAddress, sdk, privateKey }, assets: { itemsToClaim } }) => ({ contractAddress, ens, sdk, privateKey, itemsToClaim }))
@translate('pages.dappConfirm')
class DappConfirm extends React.Component {
  componentDidUpdate (prevProps) {
    if (prevProps.txParams && prevProps.txParams.value === this.props.txParams.value) return null
    this._getEthCost()
  }

  componentDidMount () {
    this._getEthCost()
  }

  _getEthCost () {
  // just pass these variables as post message data
    const amount = utils.bigNumberify(this.props.txParams.value).toString()
    const {
      chainId = '1'
    } = getHashVariables()
    this.actions().assets.getEthData({ chainId, weiAmount: amount })
  }

  async _onConfirmTx () {
    const { sdk, privateKey, contractAddress } = this.props
    const {
      data,
      to,
      value
    } = this.props.txParams

    const message = {
      from: contractAddress,
      data: data || '0x0',
      to: to || '0x0',
      operationType: 0,
      value: value || '0x0'
    }
    const { txHash, success, errors } = await sdk.execute(message, privateKey)

    widgetService.onConfirmClick({ txHash, success, errors })
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
            onClick={() => widgetService.onCloseClick()}
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
