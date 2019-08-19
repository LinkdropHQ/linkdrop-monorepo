import { BadRequestError } from '../../utils/errors'
import logger from '../../utils/logger'
import proxyFactoryService from '../proxyFactoryService'
import walletFactoryService from '../walletFactoryService'
import ClaimServiceBase from './claimServiceBase'
import walletService from '../walletService'

class ClaimServiceERC20 extends ClaimServiceBase {
  _checkClaimParams (params) {
    // check basic linkdrop params
    super._checkClaimParamsBase(params)

    // make erc20 specific checks
    if (!params.tokenAddress) {
      throw new BadRequestError('Please provide tokenAddress argument')
    }
    if (!params.tokenAmount) {
      throw new BadRequestError('Please provide tokenAddress argument')
    }
    logger.debug('Valid claim params: ' + JSON.stringify(params))
  }

  _checkParamsWithBlockchainCall (params) {
    return proxyFactoryService.checkClaimParams(params)
  }

  _sendClaimTx (params) {
    return proxyFactoryService.claim(params)
  }

  async claimAndDeploy ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    version,
    chainId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature,
    walletFactory,
    publicKey,
    initializeWithENS,
    signature
  }) {
    // this._checkClaimParams({
    //   weiAmount,
    //   tokenAddress,
    //   tokenAmount,
    //   expirationTime,
    //   linkId,
    //   linkdropMasterAddress,
    //   campaignId,
    //   version,
    //   chainId,
    //   linkdropSignerSignature,
    //   receiverAddress,
    //   receiverSignature,
    //   walletFactory,
    //   publicKey,
    //   initializeWithENS,
    //   signature
    // })

    // if (!walletFactory) {
    //   throw new BadRequestError('Please provide walletFactory argument')
    // }
    // if (!publicKey) {
    //   throw new BadRequestError('Please provide publicKey argument')
    // }
    // if (!initializeWithENS) {
    //   throw new BadRequestError('Please provide initializeWithENS argument')
    // }
    // if (!signature) {
    //   throw new BadRequestError('Please provide signature argument')
    // }

    const claimData = await walletService.getClaimData({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })

    return walletFactoryService.claimAndDeploy({
      claimData,
      publicKey,
      initializeWithENS,
      signature
    })
  }
}

export default new ClaimServiceERC20()
