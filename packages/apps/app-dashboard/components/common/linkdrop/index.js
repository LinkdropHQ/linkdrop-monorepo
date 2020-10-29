import React from 'react'
import styles from './styles.module'
import { Button } from 'components/common'
import classNames from 'classnames'
import { translate, actions } from 'decorators'
import moment from 'moment'
import { defineDefaultSymbol } from 'helpers'
import { Icons, Loading } from '@linkdrop/ui-kit'
import config from 'config-dashboard'
import { multiply, bignumber } from 'mathjs'
import { convertFromExponents, defineEtherscanUrl } from '@linkdrop/commons'
import variables from 'variables'

moment.locale('en-gb')

@actions(({
  user: {
    currentAddress,
    chainId
  }
}) => ({ currentAddress, chainId }))
@translate('common.linkdrop')
class Linkdrop extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = this.props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
  }

  componentDidMount () {
    const { status, awaitingStatus, awaitingTxHash, id, chainId } = this.props
    if (status && awaitingStatus && status !== awaitingStatus) {
      this.intervalCheck = window.setInterval(_ => this.actions().campaigns.checkStatusTxHash({ txHash: awaitingTxHash, chainId, id, newStatus: awaitingStatus }), config.balanceCheckInterval)
    }
  }

  componentWillReceiveProps ({ status, awaitingStatus, awaitingTxHash, id, chainId }) {
    const { awaitingStatus: prevAwaitingStatus } = this.props
    if (awaitingStatus != null && awaitingStatus !== prevAwaitingStatus && status !== awaitingStatus) {
      this.intervalCheck = window.setInterval(_ => this.actions().campaigns.checkStatusTxHash({ txHash: awaitingTxHash, chainId, id, newStatus: awaitingStatus }), config.balanceCheckInterval)
    }

    if (awaitingStatus === null && prevAwaitingStatus && status === prevAwaitingStatus) {
      window.clearInterval(this.intervalCheck)
    }
  }

  render () {
    const {
      tokenAmount,
      currentAddress,
      tokenSymbol,
      ethAmount,
      created,
      status,
      loading,
      chainId,
      linksAmount,
      tokenType,
      id
    } = this.props

    const etherscanUrl = defineEtherscanUrl({ chainId })
    const checkAddressUrl = `${etherscanUrl}address/${id}`

    return <div className={classNames(styles.container, { [styles.containerDisabled]: status === 'canceled' })}>
      {loading && <Loading withOverlay />}
      {this.renderTokenTypeLabel({ tokenType })}
      {this.renderTitle({ tokenAmount, tokenSymbol, ethAmount, chainId, tokenType, linksAmount })}
      {this.renderStatus({ status, id, chainId, currentAddress })}
      {this.renderDate({ created })}
      {this.renderLinksData({ chainId, linksAmount, tokenAmount, tokenSymbol, ethAmount, tokenType })}
      <div className={styles.buttons}>
        <Button disabled={status === 'canceled'} href={status !== 'canceled' && `/#/campaigns/${id}`} transparent className={styles.button}>{this.t('links')}</Button>
        <Button href={checkAddressUrl} target='_blank' transparent className={classNames(styles.button, styles.buttonWithIcon)}>{this.t('viewContract')}<Icons.ExternalLink fill={variables.dbBlue} /></Button>
      </div>
    </div>
  }

  renderTitle ({ tokenAmount, chainId, tokenSymbol, ethAmount, tokenType, linksAmount }) {
    if (tokenType === 'erc20' && !ethAmount) {
      return <div className={styles.title}>{convertFromExponents(multiply(bignumber(tokenAmount), bignumber(linksAmount)))} {tokenSymbol}</div>
    }
    if (tokenType === 'erc20' && ethAmount) {
      return <div className={styles.title}>{convertFromExponents(multiply(bignumber(tokenAmount), bignumber(linksAmount)))} {tokenSymbol} + {this.defaultSymbol}</div>
    }

    if (tokenType === 'erc721' && !ethAmount) {
      return <div className={styles.title}>{linksAmount} {tokenSymbol}</div>
    }

    if (tokenType === 'erc721' && ethAmount) {
      return <div className={styles.title}>{linksAmount} {tokenSymbol} + {this.defaultSymbol}</div>
    }

    if (tokenType === 'eth' && ethAmount) {
      return <div className={styles.title}>{convertFromExponents(multiply(bignumber(ethAmount), bignumber(linksAmount)))} {this.defaultSymbol}</div>
    }
    return null
  }

  renderStatus ({ status, id, chainId, account, currentAddress }) {
    let value = <span />
    switch (status) {
      case 'active':
        value = <span>
          <span
            className={classNames(styles.statusActive, styles.status)}
          >
            {this.t('statusType.active')}
          </span> / <span
            className={styles.status}
            onClick={_ => this.actions().campaigns.changeStatus({ action: 'pause', id, chainId, account: currentAddress })}
          >
            {this.t('statusType.pause')}
          </span>
        </span>
        break
      case 'paused':
        value = <span>
          <span
            className={classNames(styles.statusPaused, styles.status)}
          >
            {this.t('statusType.paused')}
          </span> / <span
            className={styles.status}
            onClick={_ => this.actions().campaigns.changeStatus({ action: 'unpause', id, chainId, account: currentAddress })}
          >
            {this.t('statusType.activate')}
          </span> / <span
                      className={styles.status}
                      onClick={_ => this.actions().campaigns.changeStatus({ action: 'withdraw', id, chainId, account: currentAddress })}
                              >
                      {this.t('statusType.withdraw')}
          </span>
        </span>
        break
      case 'canceled':
        value = <span>
          <span
            className={classNames(styles.statusCanceled, styles.status)}
          >
            {this.t('statusType.canceled')}
          </span>
        </span>
    }

    return <div
      className={styles.statusField}
    >
      {this.t('status')}: {value}
    </div>
  }

  renderDate ({ created }) {
    if (!created) { return }
    return <div className={styles.date}>
      {this.t('created')}: <span>{moment(created).format('LL')}</span>
    </div>
  }

  renderTokenTypeLabel ({ tokenType }) {
    return <div className={styles.tokenLabel}>
      {tokenType !== 'eth' ? tokenType : this.defaultSymbol}
    </div>
  }

  renderLinksData ({ linksAmount, tokenAmount, tokenSymbol, ethAmount, tokenType, chainId }) {
    const linksTitle = linksAmount > 1 ? this.t('linksCount') : this.t('link')
    if (tokenType === 'eth' && ethAmount) {
      return <div className={styles.links}>
        {linksAmount} {linksTitle} / {convertFromExponents(ethAmount)} {this.defaultSymbol}
      </div>
    }
    if (tokenType === 'erc20' && linksAmount && tokenAmount && tokenSymbol && ethAmount) {
      return <div className={styles.links}>
        {linksAmount} {linksTitle} / {convertFromExponents(tokenAmount)} {tokenSymbol} + {ethAmount} {this.defaultSymbol}
      </div>
    }

    return <div className={styles.links}>
      {linksAmount} {linksTitle} / {convertFromExponents(tokenAmount)} {tokenSymbol}
    </div>
  }
}

export default Linkdrop
