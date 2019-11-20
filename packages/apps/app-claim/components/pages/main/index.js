/* global web3 */
import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import { actions, translate, platform, detectBrowser } from 'decorators'
import InitialPage from './initial-page'
import WalletChoosePage from './wallet-choose-page'
import ClaimingProcessPage from './claiming-process-page'
import ErrorPage from './error-page'
import ClaimingFinishedPage from './claiming-finished-page'
import { getHashVariables, defineNetworkName, capitalize } from '@linkdrop/commons'
import { Web3Consumer } from 'web3-react'
let web3Obj
try {
  web3Obj = web3
} catch (err) {
  console.error(err)
}

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
  componentDidMount () {
    const {
      linkKey,
      chainId,
      campaignId = 0,
      linkdropContract,
      sender: senderAddress
    } = getHashVariables()
    this.actions().tokens.checkIfClaimed({
      linkKey,
      chainId,
      linkdropContract
    })
    this.actions().user.createSdk({
      senderAddress,
      chainId,
      linkKey,
      campaignId
    })
  }

  componentWillReceiveProps ({ readyToClaim, alreadyClaimed }) {
    const { readyToClaim: prevReadyToClaim } = this.props
    if (
      (readyToClaim === true && prevReadyToClaim === true) ||
      readyToClaim == null ||
      readyToClaim === false ||
      alreadyClaimed == null
    ) { return }
    const {
      token,
      tokensAmount,
      expiration,
      nft,
      feeToken,
      tokenId,
      feeAmount,
      feeReceiver,
      nativeTokensAmount,
      linkdropContract,
      linkKey,
      signerSignature,
      receiverAddress,
      chainId
    } = getHashVariables()

    // params in url:
    // token - contract/token address,
    // amount - tokens amount,
    // expirationTime - expiration time of link,
    // sender,
    // linkdropSignerSignature,
    // linkKey - private key for link,
    // chainId - network id

    // params needed for claim
    // sender: sender key address, e.g. 0x1234...ff
    // linkdropSignerSignature: ECDSA signature signed by sender (contained in claim link)
    // receiverSignature: ECDSA signature signed by receiver using link key

    // destination: destination address - can be received from web3-react context
    // token: ERC20 token address, 0x000...000 for ether - can be received from url params
    // tokenAmount: token amount in atomic values - can be received from url params
    // expirationTime: link expiration time - can be received from url params
    if (Number(expiration) < (+(new Date()) / 1000)) {
      // show error page if link expired
      return this.actions().user.setErrors({ errors: ['LINK_EXPIRED'] })
    }

    if (nft && tokenId) {
      // jsonRpcUrl,
      // apiHost,
      // token,
      // nft,
      // feeToken,
      // feeReceiver,
      // linkKey,
      // nativeTokensAmount,
      // tokensAmount,
      // tokenId,
      // feeAmount,
      // expiration,
      // signerSignature,
      // receiverAddress,
      // linkdropContract
      return this.actions().contract.getTokenERC721Data({
        nft,
        tokenId,
        chainId
        // feeToken,
        // feeReceiver,
        // feeAmount,
        // linkKey,
        // expiration,
        // nativeTokensAmount,
        // signerSignature,
        // linkdropContract
      })
    }
    this.actions().contract.getTokenERC20Data({
      token,
      nativeTokensAmount,
      tokensAmount,
      chainId
    })
  }

  render () {
    return <Web3Consumer>
      {context => this.renderCurrentPage({ context })}
    </Web3Consumer>
  }

  renderCurrentPage ({ context }) {
    const { decimals, amount, symbol, icon, step, userLoading, errors, alreadyClaimed } = this.props
    // in context we can find:
    // active,
    // connectorName,
    // connector,
    // library,
    // networkId,
    // account,
    // error
    let {
      account,
      networkId
    } = context
    if (this.isOpera) {
      if (!account || !networkId) {
        if (web3Obj && web3Obj.currentProvider && web3Obj.currentProvider.publicConfigStore && web3Obj.currentProvider.publicConfigStore.getState) {
          const data = web3Obj.currentProvider.publicConfigStore.getState()
          account = data.selectedAddress
          networkId = data.networkVersion
        }
      }
    }
    const {
      chainId,
      linkdropMasterAddress
    } = getHashVariables()
    const commonData = { linkdropMasterAddress, chainId, decimals, amount, symbol, icon, wallet: account, loading: userLoading }
    if (this.platform === 'desktop' && chainId && !account) {
      return <ErrorPage error='NETWORK_NOT_SUPPORTED' network={capitalize({ string: defineNetworkName({ chainId }) })} />
    }

    if (this.platform === 'desktop' && !account) {
      return <div>
        <ErrorPage
          error='NEED_METAMASK'
        />
      </div>
    }
    if (errors && errors.length > 0) {
      // if some errors occured and can be found in redux store, then show error page
      return <ErrorPage error={errors[0]} />
    }
    if (
      (this.platform === 'desktop' && networkId && Number(chainId) !== Number(networkId)) ||
      (this.platform !== 'desktop' && account && networkId && Number(chainId) !== Number(networkId))) {
      // if network id in the link and in the web3 are different
      return <ErrorPage error='NETWORK_NOT_SUPPORTED' network={capitalize({ string: defineNetworkName({ chainId }) })} />
    }

    if (alreadyClaimed) {
      // if tokens we already claimed (if wallet is totally empty).
      return <ClaimingFinishedPage
        {...commonData}
      />
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
        return <WalletChoosePage onClick={_ => {
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
