import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Select, PageHeader, PageLoader, NFTToken } from 'components/common'
import { TokenAddressInput, LinksContent, NextButton, AddEthField, EthTexts } from 'components/pages/common'
import config from 'config-dashboard'
import AllTokensControl from './all-tokens-control'
import Immutable from 'immutable'

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
    assetsERC721,
    symbol,
    loading: tokensLoading
  }
}) => ({
  assetsERC721,
  chainId,
  symbol,
  loading,
  proxyAddress,
  currentAddress,
  items,
  links,
  tokensLoading,
  privateKey
}))
@translate('pages.campaignCreate')
class Step1 extends React.Component {
  constructor (props) {
    super(props)
    const assetsPrepared = this.prepareAssets({ assets: props.assetsERC721 })
    const currentAsset = props.assetsERC721.find(asset => asset.address === assetsPrepared[0].value)
    this.state = {
      options: assetsPrepared,
      ethAmount: 0,
      tokenAddress: currentAsset && currentAsset.address,
      currentIds: currentAsset ? currentAsset.ids : [],
      customTokenAddress: '',
      addEth: false
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
      const assetsPrepared = this.prepareAssets({ assets })
      const currentAsset = assets.find(asset => asset.address === assetsPrepared[0].value)
      this.setState({
        options: assetsPrepared,
        tokenAddress: currentAsset.address,
        currentIds: currentAsset.ids
      }, _ => {
        this.actions().tokens.setTokenERC721Data({ address: currentAsset.address })
      })
    }
  }

  render () {
    const { currentIds, ethAmount, addEth, tokenAddress, customTokenAddress, options } = this.state
    const { privateKey, proxyAddress, symbol, assetsERC721, loading, tokensLoading } = this.props
    const tokenSymbol = (assetsERC721.find(item => item.address === tokenAddress) || {}).symbol
    return <div className={classNames(styles.container, { [styles.customTokenEnabled]: tokenSymbol === 'ERC20' })}>
      {(tokensLoading || loading) && <PageLoader />}
      <PageHeader title={this.t('titles.setupCampaign')} />
      <div className={styles.main}>
        <div className={styles.form}>
          <div className={styles.chooseTokens}>
            <h3 className={styles.subtitle}>{this.t('titles.chooseToken')}</h3>
            <Select
              options={options}
              value={tokenAddress}
              onChange={({ value }) => {
                this.setField({
                  value,
                  field: 'tokenAddress'
                })
              }}
            />
          </div>
          {this.renderTokenInputs({ addEth, ethAmount, tokenAddress, customTokenAddress })}
        </div>

        <div className={styles.summary}>
          <h3 className={styles.subtitle}>{this.t('titles.total')}</h3>
          {this.renderTexts({
            tokenAddress,
            ethAmount,
            tokenType: 'erc721',
            linksAmount: currentIds.length,
            tokenAmount: currentIds.length ? 1 : null,
            tokenSymbol: symbol || tokenSymbol,
            addEth
          })}
        </div>
      </div>
      <div>
        <h3 className={styles.subtitle}>{this.t('titles.selectNft')}</h3>
        {this.renderAllTokensControls({ tokenAddress, assetsERC721, currentIds })}
        {this.renderNFTTokens({ assetsERC721, tokenAddress, currentIds })}
      </div>
      <NextButton
        tokenAmount={1}
        ethAmount={ethAmount}
        linksAmount={currentIds.length}
        tokenSymbol={symbol || tokenSymbol}
        tokenType='erc721'
        tokenIds={currentIds}
      />
    </div>
  }

  prepareAssets ({ assets }) {
    return assets.map(({ address, symbol, name, ids }) => ({
      label: `${symbol} — ${address}`,
      value: address
    }))
  }

  renderAllTokensControls ({ tokenAddress, assetsERC721, currentIds }) {
    if (!tokenAddress || !currentIds) { return null }
    const currentAsset = assetsERC721.find(item => item.address === tokenAddress)
    if (!currentAsset) { return }
    const currentAssetIds = currentAsset.ids
    return <div>
      <AllTokensControl
        title={this.t(`buttons.${currentIds.length === currentAssetIds.length ? 'deselectAll' : 'selectAll'}`)}
        onClick={_ => {
          this.setState({
            currentIds: currentIds.length !== currentAssetIds.length ? currentAssetIds : []
          })
        }}
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

  renderTokenInputs ({ addEth, ethAmount, tokenAddress, customTokenAddress }) {
    const ethInput = <div className={styles.tokensAmount}>
      <h3 className={styles.subtitle}>{this.t('titles.ethInLink')}</h3>
      <div className={styles.tokensAmountContainer}>
        <AddEthField
          addEth={addEth}
          noMargin
          ethAmount={ethAmount}
          setField={({ value, field }) => this.setField({ value, field })}
        />
      </div>
    </div>
    switch (tokenAddress) {
      case 'ERC721':
        return <div>
          <TokenAddressInput tokenAddress={customTokenAddress} tokenType='erc721' setField={({ value, field }) => this.setField({ value, field: 'customTokenAddress' })} />
          {ethInput}
        </div>
      default:
        return <div>
          {ethInput}
        </div>
    }
  }

  renderTexts ({ ethAmount, linksAmount, tokenAddress, tokenAmount, tokenSymbol }) {
    if (!linksAmount || !tokenAddress) {
      return <p className={classNames(styles.text, styles.textGrey)}>{this.t('titles.fillTheField')}</p>
    }
    return <div>
      <p className={classNames(styles.text, styles.textMargin15)}>{linksAmount} {tokenSymbol}</p>
      <EthTexts ethAmount={ethAmount} linksAmount={linksAmount} />
      <LinksContent tokenAmount={tokenAmount} tokenSymbol={tokenSymbol} ethAmount={ethAmount} tokenType='erc721' />
      <p className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFee', { price: config.linkPrice * linksAmount }) }} />
      <p className={classNames(styles.text, styles.textGrey)} dangerouslySetInnerHTML={{ __html: this.t('titles.serviceFeePerLink', { price: config.linkPrice }) }} />
    </div>
  }

  setField ({ value, field }) {
    const { assetsERC721, chainId } = this.props
    if (field === 'ethAmount') {
      return this.setState({
        [field]: value
      })
    }

    this.setState({
      [field]: value
    }, _ => {
      if (field === 'tokenAddress' && value !== 'ERC721') {
        const currentIds = assetsERC721.find(asset => asset.address === value).ids
        this.setState({
          currentIds
        }, _ => this.actions().tokens.setTokenERC721Data({ address: value }))
      }

      // if (field === 'customTokenAddress') {
      //   if (value.length === 42) {
      //     this.actions().tokens.getTokenERC721Data({ tokenAddress: value, chainId })
      //   }
      // }
    })
  }
}

export default Step1
