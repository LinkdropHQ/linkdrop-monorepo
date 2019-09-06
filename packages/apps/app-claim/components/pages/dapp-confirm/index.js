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

  render () {
    // dont pay much attention to the name of variable itemsToClaim, I will change it soon
    const { itemsToClaim } = this.props
    const currentAsset = itemsToClaim[0]
    return <div className={styles.container}>
      <DappHeader
        title={this.t('titles.wallet')}
        onClose={_ => console.log('here is the close event')}
      />

      <div className={styles.content}>
        <div
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: this.t('titles.confirmAction', { dappName: 'Swap Tokens' }) }}
        />
        {this.renderAsset({ currentAsset })}
        <Button
          className={styles.button}
          onClick={_ => console.log('here is the continue event')}
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
      return <AssetBalance
        {...currentAsset}
        amount={currentAsset.balanceFormatted}
      />
    }
    return null
  }
}

export default DappConfirm
