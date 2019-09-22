import React from 'react'
import { DappHeader, AssetBalance } from 'components/common'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { getHashVariables } from '@linkdrop/commons'
import { ethers } from 'ethers'
import classNames from 'classnames'
import config from 'app.config.js'

@actions(({ user: { ens, contractAddress }, assets: { itemsToClaim } }) => ({ contractAddress, ens, itemsToClaim }))
@translate('pages.dappResult')
class DappResult extends React.Component {
  componentDidMount () {
    // just pass these variables as post message data
    const amount = '2967240000000000'
    const tokenAddress = '0x0000000000000000000000000000000000000000'
    const {
      chainId = config.defaultChainId
    } = getHashVariables()
    if (tokenAddress === ethers.constants.AddressZero) {
      this.actions().assets.getEthData({ chainId, weiAmount: amount })
    } else {
      this.actions().assets.getTokenERC20Data({ tokenAddress, tokenAmount: amount, chainId })
    }
  }

  render () {
    const { ens } = this.props
    // just pass that variables as post message data
    const status = 'success'
    const { itemsToClaim } = this.props
    const currentAsset = itemsToClaim[0]
    return <div className={styles.container}>
      <DappHeader
        title={this.t('titles.wallet')}
        onClose={_ => console.log('here is the close event')}
      />

      <div className={styles.content}>
        {this.renderTitles({ status })}
        {this.renderAsset({ status, currentAsset })}
        <Button
          className={styles.button}
          onClick={_ => console.log('here is the continue event')}
        >
          {this.t('buttons.ok')}
        </Button>
      </div>
    </div>
  }

  renderTitles ({ status }) {
    if (status === 'success') {
      return <div className={styles.titles}>
        <div
          className={classNames(styles.title, styles.titleSuccess)}
        >{this.t('titles.success')}
        </div>
        <div
          className={styles.title}
          dangerouslySetInnerHTML={{ __html: this.t('titles.received') }}
        />
      </div>
    }
  }

  renderAsset ({ currentAsset, status }) {
    if (currentAsset && status === 'success') {
      return <div className={styles.assets}>
        <AssetBalance
          {...currentAsset}
          amount={currentAsset.balanceFormatted}
        />
      </div>
    }
    return null
  }
}

export default DappResult
