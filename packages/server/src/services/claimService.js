import { BadRequestError } from '../utils/errors'
import logger from '../utils/logger'
import operationService from './operationService'
import linkdropService from './linkdropService'
import factoryService from './factoryService'

class ClaimService {
  _computeId ({ linkId, linkdropContractAddress }) {
    return `claim-${linkdropContractAddress.toLowerCase()}-${linkId.toLowerCase()}`
  }

  async cancel (linkdropContractAddress, linkId) {
    const claimId = this._computeId({ linkId, linkdropContractAddress })
    let operation = await operationService.findById(claimId)
    if (!operation) {
      operation = await operationService.create({
        id: claimId,
        type: 'claim'
      })
    }
    return operationService.update({ id: claimId, status: 'canceled' })
  }

  async getStatus (linkdropContractAddress, linkId) {
    const claimId = this._computeId({ linkdropContractAddress, linkId })
    const operation = await operationService.findById(claimId)
    if (!operation) {
      return 'not_claimed'
    }
    return operation.status
  }

  // Check whether a claim tx exists in database
  findClaimInDB ({ linkId, linkdropContractAddress }) {
    const id = this._computeId({ linkId, linkdropContractAddress })
    return operationService.findById(id)
  }

  findClaimById (id) {
    return operationService.findById(id)
  }

  _checkClaimParams (params) {
    if (!params.linkParams) {
      throw new BadRequestError('Please provide link params argument')
    }
    if (!params.signerSignature) {
      throw new BadRequestError('Please provide signerSignature argument')
    }
    if (!params.receiverAddress) {
      throw new BadRequestError('Please provide receiverAddress argument')
    }
    if (!params.receiverSignature) {
      throw new BadRequestError('Please provide receiverSignature argument')
    }
    if (!params.linkdropContractAddress) {
      throw new BadRequestError(
        'Please provide linkdrop contract address argument'
      )
    }
    logger.debug('Valid claim params: ' + JSON.stringify(params))
  }

  _checkParamsWithBlockchainCall (params) {
    return linkdropService.checkClaimParams(params)
  }

  _sendClaimTx (params) {
    return linkdropService.claim(params)
  }

  async claim (params) {
    // Make sure all arguments are passed
    this._checkClaimParams(params)

    // Check whether a claim tx exists in database
    const claim = await this.findClaimInDB({
      linkId: params.linkParams.linkId,
      linkdropContractAddress: params.linkdropContractAddress
    })
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

    // blockhain check that params are valid
    await this._checkParamsWithBlockchainCall(params)
    logger.debug('Blockchain params check passed. Submitting claim tx...')

    // save claim operation to database
    const claimId = this._computeId({
      linkId: params.linkParams.linkId,
      linkdropContractAddress: params.linkdropContractAddress
    })
    logger.debug('Saving claim operation to database...')
    await operationService.create({ id: claimId, type: 'claim', data: params })

    // send claim transaction to blockchain
    const tx = await this._sendClaimTx(params)
    logger.info('Submitted claim tx: ' + tx.hash)

    // add transaction details to database
    await operationService.addTransaction(claimId, tx)

    return tx.hash
  }

  async claimAndDeploy (params) {
    // Make sure all arguments are passed
    this._checkClaimParams(params)

    // Check whether a claim tx exists in database
    const claim = await this.findClaimInDB({
      linkId: params.linkParams.linkId,
      linkdropContractAddress: params.linkdropContractAddress
    })

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

    // save claim operation to database
    const claimId = this._computeId({
      linkId: params.linkParams.linkId,
      linkdropContractAddress: params.linkdropContractAddress
    })
    logger.debug('Saving claim operation to database...')
    await operationService.create({
      id: claimId,
      type: 'claimAndDeploy',
      data: params
    })

    // send claim transaction to blockchain
    const tx = await factoryService.claimAndDeploy(params)
    logger.info('Submitted claim and deploy tx: ' + tx.hash)

    // add transaction details to database
    await operationService.addTransaction(claimId, tx)

    return tx.hash
  }
}

export default new ClaimService()
