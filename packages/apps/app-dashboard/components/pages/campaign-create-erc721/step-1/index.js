import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Select, Input, PageHeader, PageLoader, NFTToken } from 'components/common'
import { TokenAddressInput, LinksContent, NextButton, AddEthField, EthTexts } from 'components/pages/common'
import config from 'config-dashboard'
import Immutable from 'immutable'

@actions(({ user: { chainId, currentAddress, loading }, campaigns: { items, proxyAddress, links }, tokens: { assetsERC721, symbol } }) => ({ assetsERC721, chainId, symbol, loading, proxyAddress, currentAddress, items, links }))
@translate('pages.campaignCreate')
class Step1 extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      options: TOKENS,
      ethAmount: '0',
      tokenAddress: null,
      currentIds: []
    }
  }

  componentDidMount () {
    const { currentAddress, chainId, proxyAddress, items } = this.props
    if (!proxyAddress) {
      this.actions().campaigns.createProxyAddress({ campaignId: items.length })
    }
    this.actions().tokens.getERC721Assets({ currentAddress })
  }

  componentWillReceiveProps ({ assetsERC721: assets }) {
    const { assetsERC721: prevAssets } = this.props
    if (assets != null && assets.length > 0 && !Immutable.fromJS(assets).equals(Immutable.fromJS(prevAssets))) {
      const assetsPrepared = assets.map(({ address, symbol, name, ids }) => ({
        label: `${name} — ${address}...`,
        value: address
      }))
      const newOptions = assetsPrepared.concat([TOKENS[0]])
      const currentIds = assets[0].ids
      this.setState({
        options: newOptions,
        tokenAddress: newOptions[0].value,
        currentIds
      }, _ => {
        this.actions().tokens.setTokenERC721Data({ address: newOptions[0].value })
      })
    }
  }

  render () {
    const { tokenSymbol, currentIds, ethAmount, tokenAmount, addEth, tokenAddress, options } = this.state
    const { symbol, assetsERC721, loading } = this.props
    return <div className={classNames(styles.container, { [styles.customTokenEnabled]: tokenSymbol === 'ERC20' })}>
      {loading && <PageLoader />}
      <PageHeader title={this.t('titles.setupCampaign')} />
      <div className={styles.main}>
        <div className={styles.form}>
          <div className={styles.chooseTokens}>
            <h3 className={styles.subtitle}>{this.t('titles.chooseToken')}</h3>
            <Select
              options={options} value={tokenAddress} onChange={({ value }) => {
                this.setField({
                  value,
                  field: 'tokenAddress'
                })
              }}
            />
          </div>
          {this.renderTokenInputs({ ethAmount })}
        </div>

        <div className={styles.summary}>
          <h3 className={styles.subtitle}>{this.t('titles.total')}</h3>
          {this.renderTexts({
            tokenAddress,
            ethAmount,
            tokenType: 'erc721',
            linksAmount: currentIds.length,
            tokenAmount,
            tokenSymbol: symbol || tokenSymbol,
            addEth
          })}
        </div>
      </div>
      <div>{currentIds.join(',')}</div>
      {this.renderNFTTokens({ assetsERC721, tokenAddress, currentIds })}
      <NextButton
        tokenAmount={tokenAmount}
        ethAmount={ethAmount}
        linksAmount={currentIds.length}
        tokenSymbol={symbol}
        tokenType='erc721'
      />
    </div>
  }

  renderNFTTokens ({ assetsERC721, tokenAddress, currentIds }) {
    const currentAsset = assetsERC721.find(item => item.address === tokenAddress)
    if (!currentAsset) { return }
    return <div className={styles.tokens}>
      {currentAsset.ids.map(id => <NFTToken
        key={`${currentAsset.address}_${id}`}
        {...currentAsset}
        id={id}
        onSelect={({ selected }) => this.onSelect({ selected, id })}
        selected={currentIds.indexOf(id) > -1}
      />)}
    </div>
  }

  onSelect ({ selected, id }) {
    const { currentIds } = this.state
    const currentIdsUpdated = selected ? currentIds.concat(id) : currentIds.filter(item => item !== id)
    this.setState({
      currentIds: currentIdsUpdated
    })
  }

  renderTokenInputs ({ ethAmount }) {
    return <div className={styles.tokensAmount}>
      <h3 className={styles.subtitle}>{this.t('titles.amountPerLink')}</h3>
      <div className={styles.tokensAmountContainer}>
        <AddEthField
          addEth
          showAlways
          ethAmount={ethAmount}
          setField={({ value, field }) => this.setField({ value, field })}
        />
      </div>
    </div>
  }

  renderTexts ({ ethAmount, linksAmount, tokenAmount, tokenSymbol }) {
    return <div>
      <p className={classNames(styles.text, styles.textMargin15)}>{linksAmount} {tokenSymbol}</p>
      {/* <EthTexts ethAmount={ethAmount} linksAmount={linksAmount} /> */}
      {/* <LinksContent tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} ethAmount={ethAmount} tokenType={tokenType} /> */}
      <p className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFee', { price: config.linkPrice * linksAmount }) }} />
      <p className={classNames(styles.text, styles.textGrey)} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFeePerLink', { price: config.linkPrice }) }} />
    </div>
  }

  setField ({ value, field }) {
    const { assetsERC721 } = this.props
    if (field === 'ethAmount') {
      return this.setState({
        [field]: value
      })
    }

    this.setState({
      [field]: value
    }, _ => {
      if (field === 'tokenAddress') {
        const currentIds = assetsERC721.find(asset => asset.address === value).ids
        this.setState({
          currentIds
        }, _ => this.actions().tokens.setTokenERC721Data({ address: value }))
      }

      // if (field === 'tokenAddress' && tokenSymbol === 'ERC20') {
      //   const tokenType = this.defineTokenType({ tokenSymbol })
      //   if (value.length === 42) {
      //     if (tokenType === 'erc20') {
      //       this.actions().tokens.getTokenERC20Data({ tokenAddress: value, chainId })
      //     }
      //   }
      // }
    })
  }
}

export default Step1

const TOKENS = [
  {
    label: 'ERC721 Token Address',
    value: 'ERC721'
  }
]
