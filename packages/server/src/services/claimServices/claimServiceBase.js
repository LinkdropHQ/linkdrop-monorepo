import { BadRequestError, NotImplementedError } from '../../utils/errors'
import logger from '../../utils/logger'
import operationService from '../operationService'
import linkdropService from '../linkdropService'

class ClaimService {
  _computeId ({ linkId, linkdropMasterAddress }) {
    return `claim-${linkdropMasterAddress.toLowerCase()}-${linkId.toLowerCase()}`
  }

  async cancel (linkdropMasterAddress, linkId) {
    const claimId = this._computeId({ linkdropMasterAddress, linkId })
    let operation = await operationService.findById(claimId)
    if (!operation) {
      operation = await operationService.create({
        id: claimId,
        type: 'claim'
      })
    }
    return operationService.update({ id: claimId, status: 'canceled' })
  }

  async getStatus (linkdropMasterAddress, linkId) {
    const claimId = this._computeId({ linkdropMasterAddress, linkId })
    const operation = await operationService.findById(claimId)
    if (!operation) {
      return 'not_claimed'
    }
    return operation.status
  }

  // Check whether a claim tx exists in database
  findClaimInDB ({ linkId, linkdropMasterAddress }) {
    const id = this._computeId({ linkId, linkdropMasterAddress })
    return operationService.findById(id)
  }

  findClaimById (id) {
    return operationService.findById(id)
  }

  _checkClaimParamsBase (params) {
    if (!params.weiAmount) {
      throw new BadRequestError('Please provide weiAmount argument')
    }
    if (!params.expirationTime) {
      throw new BadRequestError('Please provide expirationTime argument')
    }
    if (!params.version) {
      throw new BadRequestError('Please provide version argument')
    }
    if (!params.chainId) {
      throw new BadRequestError('Please provide chainId argument')
    }
    if (!params.linkId) {
      throw new BadRequestError('Please provide linkId argument')
    }
    if (!params.linkdropMasterAddress) {
      throw new BadRequestError('Please provide linkdropMasterAddress argument')
    }
    if (!params.linkdropSignerSignature) {
      throw new BadRequestError(
        'Please provide linkdropSignerSignature argument'
      )
    }
    if (!params.receiverAddress) {
      throw new BadRequestError('Please provide receiverAddress argument')
    }
    if (!params.receiverSignature) {
      throw new BadRequestError('Please provide receiverSignature argument')
    }

    if (!params.campaignId) {
      throw new BadRequestError('Please provide campaignId argument')
    }

    logger.debug('Valid claim params: ' + JSON.stringify(params))
  }

  _checkParamsWithBlockchainCall (params) {
    throw new NotImplementedError(
      'This method should be implemented in subclass'
    )
  }

  _sendClaimTx (params) {
    throw new NotImplementedError(
      'This method should be implemented in subclass'
    )
  }

  async claim (params) {
    // Make sure all arguments are passed
    this._checkClaimParams(params)

    // Check whether a claim tx exists in database
    const claim = await this.findClaimInDB(params)
    if (claim) {
      logger.info(`Existing claim transaction found: ${claim.id}`)

      if (!claim.transactions) {
        logger.warn(
          `Existing claim transaction found: ${claim.id} without transactions`
        )
        throw new Error('Claim link was already submitted')
      }

      // retrieving the latest transactoin and returning it's tx hash
      const tx = claim.transactions[claim.transactions.length - 1]
      return tx.hash
    }
    logger.debug("Claim doesn't exist in database yet. Creating new claim...")

    // compute proxyAddress from master address
    const proxyAddress = await linkdropService.getProxyAddress(
      params.linkdropMasterAddress,
      params.campaignId
    )

    logger.debug(`Proxy address computed: ${proxyAddress}`)
    params = {
      ...params,
      proxyAddress
    }

    // blockhain check that params are valid
    await this._checkParamsWithBlockchainCall(params)
    logger.debug('Blockchain params check passed. Submitting claim tx...')

    // save claim operation to database
    const claimId = this._computeId(params)
    logger.debug('Saving claim operation to database...')
    await operationService.create({ id: claimId, type: 'claim', data: params })

    // send claim transaction to blockchain
    const tx = await this._sendClaimTx(params)
    logger.info('Submitted claim tx: ' + tx.hash)

    // add transaction details to database
    await operationService.addTransaction(claimId, tx)

    return tx.hash
  }
}

export default ClaimService
