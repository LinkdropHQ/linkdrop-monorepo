import React from 'react'
import { DappHeader, AssetBalance } from 'components/common'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { getHashVariables } from '@linkdrop/commons'
import { ethers } from 'ethers'

@actions(({ user: { ens, contractAddress }, assets: { itemsToClaim } }) => ({ contractAddress, ens, itemsToClaim }))
@translate('pages.dappConfirm')
class DappConfirm extends React.Component {
  componentDidMount () {
    // just pass these variables as post message data
    const amount = '2967240000000000'
    const tokenAddress = '0x0000000000000000000000000000000000000000'
    const {
      chainId = '1'
    } = getHashVariables()
    if (tokenAddress === ethers.constants.AddressZero) {
      this.actions().assets.getEthData({ chainId, weiAmount: amount })
    } else {
      this.actions().assets.getTokenERC20Data({ tokenAddress, tokenAmount: amount, chainId })
    }
  }

  _onConfirmTx () {
    console.log("in _confirmTx: ", this.props.txParams)
    const txHash = '0xd8e96a2702b81e7350f6d907ec0754cf02a7cb911a872e9f0a74310644700f76'
    this.props.onConfirmClick(txHash)
  }
  
  render () {
    // dont pay much attention to the name of variable itemsToClaim, I will change it soon
    const { itemsToClaim, onCancelClick } = this.props
    const currentAsset = itemsToClaim[0]
    return <div className={styles.container}>
      <DappHeader
        title={this.t('titles.wallet')}
        onClose={onCancelClick}
      />

      <div className={styles.content}>
        <div
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: this.t('titles.confirmAction', { dappName: 'Swap Tokens' }) }}
        />
        {this.renderAsset({ currentAsset })}
        <Button
          className={styles.button}
          onClick={this._onConfirmTx.bind(this)}
        >
          {this.t('buttons.confirm')}
        </Button>
      </div>
      <div
        className={styles.footer}
        dangerouslySetInnerHTML={{ __html: this.t('texts.dapp') }}
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
