import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import { actions, translate, platform, detectBrowser } from 'decorators'
import InitialPage from './initial-page'
import WalletChoosePage from './wallet-choose-page'
import ClaimingProcessPage from './claiming-process-page'
import ErrorPage from './error-page'
import ClaimingFinishedPage from './claiming-finished-page'
import NeedWallet from './need-wallet'
import { terminalApiKey, terminalProjectId } from 'app.config.js'
import { getHashVariables, defineNetworkName, capitalize } from '@linkdrop/commons'
import Web3 from 'web3'
import { TerminalHttpProvider, SourceType } from '@terminal-packages/sdk'

@actions(({ user: { errors, step, loading: userLoading, readyToClaim, alreadyClaimed }, tokens: { transactionId }, contract: { loading, decimals, amount, symbol, icon } }) => ({
  userLoading,
  loading,
  decimals,
  symbol,
  amount,
  icon,
  step,
  transactionId,
  errors,
  alreadyClaimed,
  readyToClaim
}))
@platform()
@detectBrowser()
@translate('pages.claim')
class Claim extends React.Component {
  constructor (props) {
    super(props)
    const { web3Provider } = props
    const currentProvider = web3Provider && createTerminalProvider({ web3Provider })
    this.state = {
      accounts: null,
      connectorChainId: null,
      currentProvider
    }
  }

  createTerminalProvider ({ web3Provider }) {
    return web3Provider
    // return new Web3(web3Provider)
    // const web3 = new Web3(
    //   new TerminalHttpProvider({
    //     apiKey: terminalApiKey,
    //     projectId: terminalProjectId,
    //     source: SourceType.Terminal,
    //     customHttpProvider: web3Provider
    //   })
    // );
  }

  async componentDidMount () {
    const {
      linkKey,
      chainId,
      linkdropMasterAddress,
      campaignId
    } = getHashVariables()
    const { currentProvider } = this.state
    this.actions().tokens.checkIfClaimed({ linkKey, chainId, linkdropMasterAddress, campaignId })
    this.actions().user.createSdk({ linkdropMasterAddress, chainId, linkKey, campaignId })
    if (currentProvider) {
      const { accounts, connectorChainId } = await this.getProviderData({ currentProvider })
      this.setState({
        accounts, connectorChainId
      })
    }
  }

  componentWillReceiveProps ({ readyToClaim, alreadyClaimed, context, step }) {
    const { readyToClaim: prevReadyToClaim, context: prevContext } = this.props
    
    if (context &&
      context.error &&
      context.error.name &&
      context.error.name === 'UnsupportedChainIdError' &&
      prevContext.error.name !== 'UnsupportedChainIdError'
    ) {
      return this.actions().user.setErrors({ errors: ['CONNECTOR_NETWORK_NOT_SUPPORTED'] })
    }
    if (
      (readyToClaim === true && prevReadyToClaim === true) ||
      readyToClaim == null ||
      readyToClaim === false ||
      alreadyClaimed == null
    ) {
      if (step === 2) {
        if (context.active && context.account && !prevContext.account && !prevContext.active) {
          this.actions().user.setStep({ step: 1 })
        }
      }
      return
    }
    const {
      tokenAddress,
      weiAmount,
      tokenAmount,
      expirationTime,
      chainId,
      nftAddress,
      tokenId,
      name
    } = getHashVariables()
    if (Number(expirationTime) < (+(new Date()) / 1000)) {
      // show error page if link expired
      return this.actions().user.setErrors({ errors: ['LINK_EXPIRED'] })
    }

    if (nftAddress && tokenId) {
      return this.actions().contract.getTokenERC721Data({ nftAddress, tokenId, chainId, name })
    }
    this.actions().contract.getTokenERC20Data({ tokenAddress, weiAmount, tokenAmount, chainId })
  }

  render () {
    const { context } = this.props
    return this.renderCurrentPage({ context })
  }

  async getProviderData ({ currentProvider }) {
    const accounts = await currentProvider.eth.getAccounts()
    const connectorChainId = await currentProvider.eth.getChainId()
    return { accounts, connectorChainId }
  }

  renderCurrentPage ({ context }) {
    const { decimals, amount, symbol, icon, step, userLoading, errors, alreadyClaimed, web3Provider, readyToClaim } = this.props
    const { connectorChainId } = this.state
    const {
      account
    } = context

    if (!readyToClaim) { return <Loading /> }
    {/*return <ErrorPage error='NETWORK_NOT_SUPPORTED' />*/}
    const {
      chainId,
      linkdropMasterAddress
    } = getHashVariables()
    const commonData = { linkdropMasterAddress, chainId, decimals, amount, symbol, icon, wallet: account, loading: userLoading }
    // if (this.platform === 'desktop' && chainId && !account) {
    //   return <ErrorPage error='NETWORK_NOT_SUPPORTED' network={capitalize({ string: defineNetworkName({ chainId }) })} />
    // }

    if (alreadyClaimed) {
      // if tokens we already claimed (if wallet is totally empty).
      return <ClaimingFinishedPage
        {...commonData}
      />
    }

    if (errors && errors.length > 0) {
      // if some errors occured and can be found in redux store, then show error page
      return <ErrorPage
        error={errors[0]}
        network={capitalize({ string: defineNetworkName({ chainId }) })}
      />
    }

    if (this.platform === 'desktop' && !account) {
      return <NeedWallet context={context} />
    }
    
    if (
      (this.platform === 'desktop' && connectorChainId && Number(chainId) !== Number(connectorChainId)) ||
      (this.platform !== 'desktop' && account && connectorChainId && Number(chainId) !== Number(connectorChainId))) {
      // if network id in the link and in the web3 are different
      return <ErrorPage error='NETWORK_NOT_SUPPORTED' network={capitalize({ string: defineNetworkName({ chainId }) })} />
    }

    switch (step) {
      case 1:
        return <InitialPage
          {...commonData}
          onClick={_ => {
            if (account) {
              // if wallet account was found in web3 context, then go to step 4 and claim data
              return this.actions().user.setStep({ step: 4 })
            }
            // if wallet was not found in web3 context, then go to step 2 with wallet select page and instructions
            this.actions().user.setStep({ step: 2 })
          }}
        />
      case 2:
        // page with wallet select component
        return <WalletChoosePage
          context={context}
          onClick={_ => {
            this.actions().user.setStep({ step: 3 })
          }}
        />
      case 3:
        // page with info about current wallet and button to claim tokens
        return <InitialPage
          {...commonData}
          onClick={_ => {
            this.actions().user.setStep({ step: 4 })
          }}
        />
      case 4:
        // claiming is in process
        return <ClaimingProcessPage
          {...commonData}
        />
      case 5:
        // claiming finished successfully
        return <ClaimingFinishedPage
          {...commonData}
        />
      default:
        // зloading
        return <Loading />
    }
  }
}

export default Claim
