import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { factory, linksLimit, masterCopy } from 'app.config.js'
import { defineNetworkName, convertFromExponents } from '@linkdrop/commons'
import { ethers, utils } from 'ethers'

@actions(({ user: { loading, chainId }, campaigns: { items, current } }) => ({ chainId, items, current, loading }))
@translate('pages.campaignCreate')
class Step6 extends React.Component {

  render () {
    const { items, current, campaignToCheck, loading } = this.props
    const currentCampaign = items.find(item => item.id === (campaignToCheck || current)) || {}
    const { ethAmount, defaultWallet, currentAddress, privateKey, linksAmount, tokenDecimals, chainId, tokenAddress, tokenAmount, campaignId } = currentCampaign
    const networkName = defineNetworkName({ chainId })
    const weiAmount = utils.parseEther(convertFromExponents(ethAmount || 0))
    const tokenAmountFormatted = utils.parseUnits(
      String(tokenAmount || 0),
      tokenDecimals || 0
    )
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.useTerminalApp')}</div>
      <div className={styles.instruction}>
        {this.t('texts.scriptInstruction', { linksLimit })}
      </div>
      <div className={styles.styleBlock}>
        {this.t('texts.terminalApp')}
      </div>

      <div className={styles.content}>
        <div className={styles.subtitle}>{this.t('titles.cloneLinkdropMonorepo')}</div>
        <xmp className={classNames(styles.styleBlock, styles.codeBlock, styles.marginBottom50)} dangerouslySetInnerHTML={{ __html: 'git clone https://github.com/LinkdropHQ/generate-links.git' }}/>

        <div
          className={styles.subtitle}
          dangerouslySetInnerHTML={{ __html: this.t('titles.fillInConfig') }}
        />

        <xmp className={classNames(styles.styleBlock, styles.codeBlock)}>
          {this.t('texts.codeBlockScript', {
            linksAmount,
            chain: networkName,
            masterCopy,
            weiAmount: ethAmount ? weiAmount : 0,
            tokenAddress: tokenAddress || ethers.constants.AddressZero,
            tokenAmount: tokenAmount ? tokenAmountFormatted : 0,
            campaignId,
            factory,
            masterAddress: currentAddress,
            signingKey: privateKey
          })}
        </xmp>

        <div className={styles.styleBlock}>
          {this.t('texts.payAttention')}
        </div>

        <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.generateLinks') }} />
        <div className={styles.text}>
          {this.t('texts.scriptDescription')}
        </div>

        <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.csvFile') }} />
      </div>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('texts.sendViaIntercom') }}/>
    </div>
  }
}

export default Step6
