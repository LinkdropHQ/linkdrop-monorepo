import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { defineDefaultSymbol } from 'helpers'
import { ethers } from 'ethers'
import classNames from 'classnames'
import { Select, Input, PageHeader, PageLoader } from 'components/common'
import config from 'config-dashboard'
import Immutable from 'immutable'
import wallets from 'wallets'
import { TokenAddressInput, LinksContent, NextButton, AddEthField, EthTexts } from 'components/pages/common'

@actions(({
  user: {
    chainId,
    currentAddress,
    loading,
    privateKey
  },
  campaigns: {
    items,
    proxyAddress,
    links
  },
  tokens: {
    assets,
    symbol,
    currentEthBalance,
    currentTokenBalance
  }
}) => ({
  assets,
  privateKey,
  chainId,
  symbol,
  loading,
  proxyAddress,
  currentAddress,
  items,
  links,
  currentEthBalance,
  currentTokenBalance
}))
@translate('pages.campaignCreate')
class Step1 extends React.Component {
  constructor (props) {
    super(props)
    const { assets, chainId } = this.props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
    this.TOKENS = [
      {
        label: `${this.defaultSymbol} — ${(ethers.constants.AddressZero).slice(0, 35)}...`,
        value: this.defaultSymbol
      }, {
        label: 'ERC20 Token Address',
        value: 'ERC20'
      }
    ]
    this.WALLETS = this.createWalletOptions()
    const assetsPrepared = this.prepareAssets({ assets, chainId })
    this.state = {
      options: assetsPrepared,
      tokenSymbol: assetsPrepared[0].value,
      tokenAmount: '0',
      ethAmount: '0',
      linksAmount: '0',
      addEth: false,
      tokenAddress: null,
      wallet: this.WALLETS[0].value
    }
  }

  createWalletOptions () {
    return (['trust', 'coinbase', 'opera', 'status', 'imtoken', 'gowallet', 'buntoy', 'tokenpocket', 'fortmatic', 'portis']).map(wallet => {
      const label = wallets[wallet].name
      return {
        label: wallet === 'trust' ? `Default: ${label}` : label,
        value: wallet
      }
    })
  }

  componentDidMount () {
    const { currentAddress, chainId, proxyAddress, items } = this.props
    if (!proxyAddress) {
      this.actions().campaigns.createProxyAddress({ campaignId: items.length })
    }
    this.actions().tokens.getAssets({ currentAddress })
  }

  componentWillReceiveProps ({ assets }) {
    const { assets: prevAssets } = this.props
    if (assets != null && assets.length > 0 && !Immutable.fromJS(assets).equals(Immutable.fromJS(prevAssets))) {
      const assetsPrepared = this.prepareAssets({ assets })
      this.setState({
        options: assetsPrepared,
        tokenSymbol: assetsPrepared[0].value
      })
    }
  }

  render () {
    const { tokenSymbol, ethAmount, linksAmount, tokenAmount, wallet, addEth, tokenAddress, options } = this.state
    const { symbol, loading, currentEthBalance, currentTokenBalance, chainId, privateKey, proxyAddress } = this.props
    const tokenType = this.defineTokenType({ tokenSymbol })
    return <div className={classNames(styles.container, { [styles.customTokenEnabled]: tokenSymbol === 'ERC20' })}>
      {loading && <PageLoader />}
      <PageHeader title={this.t('titles.setupCampaign')} />
      <div className={styles.main}>
        <div className={styles.form}>
          <div className={styles.chooseTokens}>
            <h3 className={styles.subtitle}>{this.t('titles.chooseToken')}</h3>
            <Select
              options={options} value={tokenSymbol} onChange={({ value }) => {
                if (value !== this.defaultSymbol && value !== 'ERC20') {
                  const currentAddress = options.find(option => option.value === value).address
                  this.setState({
                    tokenAddress: currentAddress
                  }, _ => {
                    this.setField({ field: 'tokenSymbol', value })
                  })
                } else {
                  this.setState({
                    tokenAddress: null
                  }, _ => {
                    this.setField({ field: 'tokenSymbol', value })
                  })
                }
              }}
            />
            <div className={styles.currentBalance}>
              {currentTokenBalance !== null && tokenType === 'erc20' && <div>{this.t('titles.balance')} {currentTokenBalance} {tokenType === 'erc20' ? symbol : tokenSymbol}</div>}
              <div>{this.t('titles.etherBalance')} {currentEthBalance} {this.t('titles.eth')}</div>
            </div>
          </div>
          {this.renderTokenInputs({ ethAmount, tokenType, tokenAddress, symbol, tokenSymbol, tokenAmount, addEth })}
          <div className={styles.linksAmount}>
            <h3 className={styles.subtitle}>{this.t('titles.totalLinks')}</h3>
            <div className={styles.linksAmountContainer}>
              <Input numberInput decimalSeparator={false} className={styles.input} value={linksAmount} onChange={({ value }) => this.setField({ field: 'linksAmount', value: parseFloat(value) })} />
            </div>
          </div>
          <div className={styles.chooseWallet}>
            <h3 className={styles.subtitle}>{this.t('titles.receiverWallet')}</h3>
            <Select
              options={this.WALLETS}
              value={wallet}
              onChange={({ value }) => {
                this.setState({
                  wallet: value
                })
              }}
            />
          </div>
        </div>

        <div className={styles.summary}>
          <h3 className={styles.subtitle}>{this.t('titles.total')}</h3>
          {this.renderTexts({
            tokenAddress,
            ethAmount,
            tokenType,
            linksAmount,
            tokenAmount,
            tokenSymbol: symbol || tokenSymbol,
            addEth
          })}
        </div>
      </div>
      <NextButton
        tokenAmount={tokenAmount}
        ethAmount={ethAmount}
        linksAmount={linksAmount}
        tokenSymbol={symbol || tokenSymbol}
        tokenType={tokenType}
        wallet={wallet}
      />
    </div>
  }

  renderTokenInputs ({ tokenType, tokenAddress, symbol, tokenSymbol, tokenAmount, ethAmount, addEth }) {
    const value = tokenType === 'erc20' ? tokenAmount : ethAmount
    const fieldToChange = tokenType === 'erc20' ? 'tokenAmount' : 'ethAmount'
    const amountInput = <div className={styles.tokensAmount}>
      <h3 className={styles.subtitle}>{this.t('titles.amountPerLink')}</h3>
      <div className={styles.tokensAmountContainer}>
        <Input
          disabled={tokenType === 'erc20' && !symbol && !tokenSymbol}
          numberInput
          suffix={tokenType === 'erc20' ? symbol : tokenSymbol}
          className={styles.input}
          value={value}
          onChange={({ value }) => this.setField({ field: fieldToChange, value: parseFloat(value) })}
        />
        <AddEthField
          tokenType={tokenType}
          addEth={addEth}
          ethAmount={ethAmount}
          setField={({ value, field }) => this.setField({ value, field })}
        />
      </div>
    </div>
    switch (tokenSymbol) {
      case 'ERC20':
        return <div>
          <TokenAddressInput tokenAddress={tokenAddress} tokenType={tokenType} setField={({ value, field }) => this.setField({ value, field })} />
          {amountInput}
        </div>
      case this.defaultSymbol:
      default:
        return <div>
          {amountInput}
        </div>
    }
  }

  prepareAssets ({ assets, chainId }) {
    const formattedAssets = assets.map(({ address, symbol }) => ({
      label: `${symbol} — ${(address)}`,
      value: symbol,
      address
    }))
    return [this.TOKENS[0]].concat(formattedAssets).concat([this.TOKENS[1]])
  }

  defineTokenType ({ tokenSymbol, chainId }) {
    if (tokenSymbol === this.defaultSymbol) {
      return 'eth'
    }
    return 'erc20'
  }

  renderTexts ({ ethAmount, tokenAddress, linksAmount, tokenAmount, tokenSymbol, addEth, tokenType }) {
    const value = tokenType === 'erc20' ? tokenAmount : ethAmount
    if (tokenType === 'erc20') {
      if (tokenSymbol === 'ERC20') {
        if (!linksAmount || !value || !tokenAddress) {
          return <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.fillTheField')}</p>
        }
      } else {
        if (!linksAmount || !value) {
          return <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.fillTheField')}</p>
        }
      }
    }
    if (tokenType === 'eth') {
      if (!linksAmount || Number(linksAmount) === 0 || !value || Number(value) === 0) {
        return <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.fillTheField')}</p>
      }
    }
    return <div>
      {tokenType === 'erc20' && <p className={classNames(styles.text, styles.textMargin15)}>{value * linksAmount} {tokenSymbol}</p>}
      <EthTexts ethAmount={ethAmount} linksAmount={linksAmount} />
      <LinksContent tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} ethAmount={ethAmount} tokenType={tokenType} />
      <p className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFee', { symbol: this.defaultSymbol, price: config.linkPrice * linksAmount }) }} />
      <p className={classNames(styles.text, styles.textGrey)} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFeePerLink', { symbol: this.defaultSymbol, price: config.linkPrice }) }} />
    </div>
  }

  setField ({ value, field }) {
    const { tokenSymbol } = this.state
    const { chainId } = this.props
    if (field === 'tokenAddress' && value.length > 42) { return }
    if (field === 'ethAmount' || field === 'tokenAmount') {
      return this.setState({
        [field]: value
      })
    }
    this.setState({
      [field]: value
    }, _ => {
      if (field === 'tokenSymbol') {
        this.setState({
          ethAmount: 0,
          addEth: false
        }, _ => {
          if (value !== 'ERC20' && value !== this.defaultSymbol) {
            this.actions().tokens.setTokenERC20Data({ tokenSymbol: value })
          } else if (value === 'ERC20' || value === this.defaultSymbol) {
            this.actions().tokens.emptyTokenERC20Data()
          }
        })
      }

      if (field === 'tokenAddress' && tokenSymbol === 'ERC20') {
        const tokenType = this.defineTokenType({ tokenSymbol, chainId })
        if (value.length === 42) {
          if (tokenType === 'erc20') {
            this.actions().tokens.getTokenERC20Data({ tokenAddress: value, chainId })
          }
        }
      }
    })
  }
}

export default Step1
