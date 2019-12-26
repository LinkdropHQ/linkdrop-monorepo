import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { PageHeader, PageLoader, Instruction } from 'components/common'
import EthAmountData from './eth-amount-data'
import LinkContents from './link-contents'
import ApproveSummary from './approve-summary'
import NextButton from './next-button'
import config from 'config-dashboard'
import { defineDefaultSymbol } from 'helpers'
import { linksLimit } from 'app.config.js'

@actions(({
  user: {
    loading,
    currentAddress,
    errors,
    chainId
  },
  tokens: {
    ethBalanceFormatted,
    erc20BalanceFormatted,
    address,
    erc721IsApproved
  },
  metamask: {
    status: metamaskStatus
  },
  campaigns: {
    ethAmount,
    tokenAmount,
    linksAmount,
    proxyAddress,
    tokenType,
    tokenSymbol
  }
}) => ({
  ethAmount,
  tokenAmount,
  linksAmount,
  address,
  errors,
  tokenSymbol,
  loading,
  currentAddress,
  metamaskStatus,
  chainId,
  ethBalanceFormatted,
  proxyAddress,
  tokenType,
  erc20BalanceFormatted,
  erc721IsApproved
}))
@translate('pages.campaignCreate')
class Step2 extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
    this.state = {
      loading: false
    }
  }

  componentWillReceiveProps ({ linksAmount, erc721IsApproved, metamaskStatus, errors, ethBalanceFormatted, erc20BalanceFormatted }) {
    const {
      metamaskStatus: prevMetamaskStatus,
      errors: prevErrors,
      erc20BalanceFormatted: prevErc20BalanceFormatted,
      proxyAddress,
      chainId,
      address: tokenAddress,
      currentAddress,
      tokenType,
      erc721IsApproved: prevErc721IsApproved,
      ethBalanceFormatted: prevEthBalanceFormatted
    } = this.props

    if (metamaskStatus && metamaskStatus === 'finished' && metamaskStatus !== prevMetamaskStatus) {
      this.setState({
        loading: true
      }, _ => {
        if (tokenType === 'eth') {
          this.intervalCheck = window.setInterval(_ => this.actions().tokens.getEthBalance({ account: proxyAddress, chainId }), config.balanceCheckInterval)
        } else if (tokenType === 'erc20') {
          this.intervalCheck = window.setInterval(_ => this.actions().tokens.getERC20Balance({ chainId, tokenAddress, account: proxyAddress, currentAddress }), config.balanceCheckInterval)
        } else {
          this.intervalCheck = window.setInterval(_ => this.actions().tokens.getERC721Approved({ chainId, tokenAddress, account: proxyAddress, currentAddress }), config.balanceCheckInterval)
        }
      })
    }

    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      this.setState({
        loading: false
      }, _ => {
        window.alert(this.t(`errors.${errors[0]}`))
        this.intervalCheck && window.clearInterval(this.intervalCheck)
      })
    }

    if (tokenType === 'eth') {
      if (ethBalanceFormatted && Number(ethBalanceFormatted) > 0 && ethBalanceFormatted !== prevEthBalanceFormatted) {
        this.setState({
          loading: false
        }, _ => {
          this.intervalCheck && window.clearInterval(this.intervalCheck)
          // if links amount > 1000 -> go to script page
          if (linksAmount >= linksLimit) {
            return window.setTimeout(_ => this.actions().campaigns.save({ links: [] }), config.nextStepTimeout)
          }
          window.setTimeout(_ => this.actions().user.setStep({ step: 4 }), config.nextStepTimeout)
        })
      }
    } else if (tokenType === 'erc20') {
      if (erc20BalanceFormatted && Number(erc20BalanceFormatted) > 0 && erc20BalanceFormatted !== prevErc20BalanceFormatted) {
        this.setState({
          loading: false
        }, _ => {
          this.intervalCheck && window.clearInterval(this.intervalCheck)
          if (linksAmount >= linksLimit) {
            return window.setTimeout(_ => this.actions().campaigns.save({ links: [] }), config.nextStepTimeout)
          }
          window.setTimeout(_ => this.actions().user.setStep({ step: 3 }), config.nextStepTimeout)
        })
      }
    } else {
      if (erc721IsApproved && !prevErc721IsApproved) {
        this.setState({
          loading: false
        }, _ => {
          this.intervalCheck && window.clearInterval(this.intervalCheck)
          if (linksAmount >= linksLimit) {
            return window.setTimeout(_ => this.actions().campaigns.save({ links: [] }), config.nextStepTimeout)
          }
          window.setTimeout(_ => this.actions().user.setStep({ step: 3 }), config.nextStepTimeout)
        })
      }
    }
  }

  render () {
    const { ethAmount, tokenType, tokenAmount, linksAmount, tokenSymbol, loading, currentAddress } = this.props
    const { loading: stateLoading } = this.state
    return <div className={styles.container}>
      {(stateLoading || loading) && <PageLoader transaction={stateLoading} />}
      <PageHeader title={this.t('titles.summaryPay')} />
      <div className={styles.main}>
        <div className={styles.summary}>
          <div className={styles.summaryBox}>
            <div>
              <div className={styles.data}>
                <h3 className={styles.dataTitle}>
                  {this.t('titles.linksToGenerate')}
                </h3>

                <div className={styles.dataContent}>
                  {linksAmount}
                </div>
              </div>
              <div className={styles.data}>
                <h3 className={styles.dataTitle}>
                  {this.t('titles.serviceFeeTitle')}
                </h3>
                <div className={styles.dataContent}>
                  {`${linksAmount * config.linkPrice} ${this.defaultSymbol}`}
                </div>
                <div className={styles.extraDataContent}>
                  {this.t('titles.ethPerLink', { symbol: this.defaultSymbol, eth: config.linkPrice })}
                </div>

              </div>
            </div>

            <div>
              <div className={styles.data}>
                <h3 className={styles.dataTitle}>
                  {this.t('titles.oneLinkContainsTitle')}
                </h3>
                <div className={styles.dataContent}>
                  <LinkContents />
                </div>

              </div>
              <EthAmountData />
            </div>
          </div>
          <div className={styles.serviceFee}>{this.t('texts._18')}</div>
          <ApproveSummary tokenType={tokenType} linksAmount={linksAmount} serviceFee={config.linkPrice} ethAmount={ethAmount} tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} />
          <NextButton
            tokenType={tokenType}
            tokenAmount={tokenAmount}
            currentAddress={currentAddress}
            linksAmount={linksAmount}
            ethAmount={ethAmount}
            serviceFee={config.linkPrice}
          />
        </div>
        <div className={styles.description}>
          <Instruction linksAmount={linksAmount} ethAmount={ethAmount} tokenAmount={tokenAmount} tokenType={tokenType} />
        </div>
      </div>
    </div>
  }
}

export default Step2
