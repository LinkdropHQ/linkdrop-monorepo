import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Button, PageHeader, MetamaskPopup, PageLoader, Instruction } from 'components/common'
import config from 'config-dashboard'
import { multiply, add, bignumber, subtract } from 'mathjs'
import EthSummaryBlock from './eth-summary-block'

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
    address
  },
  metamask: {
    status: metamaskStatus
  },
  campaigns: {
    ethAmount,
    tokenAmount,
    proxyAddress,
    linksAmount,
    tokenType,
    tokenSymbol
  }
}) => ({
  ethAmount,
  tokenAmount,
  metamaskStatus,
  linksAmount,
  errors,
  tokenSymbol,
  loading,
  currentAddress,
  chainId,
  address,
  proxyAddress,
  tokenType,
  ethBalanceFormatted,
  erc20BalanceFormatted
})
)
@translate('pages.campaignCreate')
class Step3 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentWillReceiveProps ({ metamaskStatus, errors, ethBalanceFormatted, erc20BalanceFormatted }) {
    const {
      metamaskStatus: prevMetamaskStatus,
      errors: prevErrors,
      proxyAddress,
      ethBalanceFormatted: prevEthBalanceFormatted,
      chainId
    } = this.props

    if (metamaskStatus && metamaskStatus === 'finished' && metamaskStatus !== prevMetamaskStatus) {
      return this.setState({
        loading: true
      }, _ => {
        this.intervalEthCheck = window.setInterval(_ => this.actions().tokens.getEthBalance({ account: proxyAddress, chainId }), config.balanceCheckInterval)
      })
    }
    if (errors && errors[0] && prevErrors.length === 0 && errors[0] !== prevErrors[0]) {
      window.alert(this.t(`errors.${errors[0]}`))
      this.setState({
        loading: false
      }, _ => {
        this.intervalEthCheck && window.clearInterval(this.intervalEthCheck)
      })
    }

    if (ethBalanceFormatted && Number(ethBalanceFormatted) > 0 && ethBalanceFormatted !== prevEthBalanceFormatted) {
      this.setState({
        loading: false
      }, _ => {
        this.intervalEthCheck && window.clearInterval(this.intervalEthCheck)
        window.setTimeout(_ => this.actions().user.setStep({ step: 4 }), config.nextStepTimeout)
      })
    }
  }

  render () {
    const { loading: stateLoading } = this.state
    const { linksAmount, ethAmount, chainId, currentAddress, loading } = this.props
    const ethAmountFinal = multiply(add(bignumber(ethAmount), bignumber(config.linkPrice)), linksAmount)
    const serviceFee = multiply(bignumber(config.linkPrice), bignumber(linksAmount))
    return <div className={styles.container}>
      {(loading || stateLoading) && <PageLoader />}
      <PageHeader title={this.t('titles.sendEth', { ethAmount: ethAmountFinal })} />
      <div className={styles.main}>
        <div className={styles.description}>
          <p className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('texts._10') }} />
        </div>
        <div className={styles.scheme}>
          <Instruction linksAmount={linksAmount} ethAmount={ethAmount} />
        </div>
      </div>
      <EthSummaryBlock ethTotal={ethAmountFinal} ethToDistribute={subtract(bignumber(ethAmountFinal), bignumber(serviceFee))} serviceFee={serviceFee} text={this.t} />
      <div className={styles.controls}>
        <Button
          disabled={loading || stateLoading}
          className={styles.button}
          onClick={_ => {
            this.actions().metamask.sendEth({ ethAmount: ethAmountFinal, account: currentAddress, chainId })
          }}
        >
          {this.t('buttons.send')}
        </Button>
      </div>
    </div>
  }
}

export default Step3
