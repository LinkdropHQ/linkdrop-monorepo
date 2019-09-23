import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import { actions, translate, platform } from 'decorators'
import InitialPage from './initial-page'
import { Page } from 'components/pages'
import ClaimingProcessPage from './claiming-process-page'
import ErrorPage from './error-page'
import ClaimingFinishedPage from './claiming-finished-page'
import { getHashVariables } from '@linkdrop/commons'

@actions(({ user: { chainId, errors, step, loading: userLoading, readyToClaim, alreadyClaimed, contractAddress }, tokens: { transactionId }, assets: { loading, itemsToClaim } }) => ({
  userLoading,
  loading,
  itemsToClaim,
  step,
  transactionId,
  errors,
  alreadyClaimed,
  readyToClaim,
  chainId,
  contractAddress
}))
@platform()
@translate('pages.claim')
class Claim extends React.Component {
  componentDidMount () {
    const { contractAddress, chainId } = this.props
    const {
      linkKey,
      linkdropMasterAddress,
      campaignId
    } = getHashVariables()
    this.actions().tokens.checkIfClaimed({ linkKey, chainId, linkdropMasterAddress, campaignId })
    this.actions().assets.getItems({ wallet: contractAddress, chainId })
  }

  componentWillReceiveProps ({ readyToClaim, alreadyClaimed, chainId }) {
    const { readyToClaim: prevReadyToClaim } = this.props
    if (
      (readyToClaim === true && prevReadyToClaim === true) ||
      readyToClaim == null ||
      readyToClaim === false ||
      alreadyClaimed == null
    ) { return }
    const {
      tokenAddress,
      weiAmount,
      tokenAmount,
      expirationTime,
      nftAddress,
      tokenId
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
    if (Number(expirationTime) < (+(new Date()) / 1000)) {
      // show error page if link expired
      return this.actions().user.setErrors({ errors: ['LINK_EXPIRED'] })
    }
    this.getAssetsData({ nftAddress, tokenId, weiAmount, chainId, tokenAddress, tokenAmount })
  }

  getAssetsData ({ nftAddress, tokenId, weiAmount, chainId, tokenAddress, tokenAmount }) {
    if (nftAddress && tokenId) {
      // this.actions().assets.getTokenERC721Data({ nftAddress, tokenId, chainId })
    } else {
      this.actions().assets.getTokenERC20Data({ tokenAddress, tokenAmount, chainId })
    }
    setTimeout(_ => this.actions().assets.getEthData({ weiAmount, chainId }), 3000)
  }

  render () {
    return <Page dynamicHeader>
      {this.renderCurrentPage()}
    </Page>
  }

  renderCurrentPage () {
    const { step, chainId, itemsToClaim, userLoading, errors, alreadyClaimed, contractAddress, loading } = this.props
    const {
      linkdropMasterAddress
    } = getHashVariables()
    const commonData = { linkdropMasterAddress, chainId, itemsToClaim, loading: userLoading || loading, wallet: contractAddress }
    if (errors && errors.length > 0) {
      // if some errors occured and can be found in redux store, then show error page
      return <ErrorPage error={errors[0]} />
    }

    if (alreadyClaimed) {
      // if tokens we already claimed (if wallet is totally empty).
      return <ClaimingFinishedPage
        {...commonData}
        alreadyClaimed
      />
    }
    switch (step) {
      case 1:
        return <InitialPage
          {...commonData}
          onClick={_ => this.actions().user.setStep({ step: 2 })}
        />
      case 2:
        // claiming is in process
        return <ClaimingProcessPage
          {...commonData}
        />
      case 3:
        // claiming finished successfully
        return <ClaimingFinishedPage
          {...commonData}
          claimingFinished
        />
      default:
        // зloading
        return <Loading />
    }
  }
}

export default Claim
