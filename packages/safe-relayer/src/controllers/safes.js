import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import safeCreationService from '../services/safeCreationService'

export const create = wrapAsync(async (req, res, next) => {
  try {
    logger.info('POST api/v1/safes/')
    logger.json(req.body, 'info')

    const { owner, name, saltNonce } = req.body
    assert.string(owner, 'Owner is required')
    assert.string(name, 'Name is required')
    assert.integer(saltNonce, 'Salt nonce is required')

    const {
      success,
      txHash,
      safe,
      linkdropModule,
      errors
    } = await safeCreationService.create({
      owner,
      name,
      saltNonce
    })

    res.json({
      success,
      txHash,
      safe,
      linkdropModule,
      errors
    })
  } catch (err) {
    next(err)
  }
})

export const claimAndCreate = wrapAsync(async (req, res, next) => {
  try {
    logger.info('POST api/v1/safes/claimAndCreate')
    logger.json(req.body, 'info')

    const {
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      owner,
      name,
      saltNonce
    } = req.body
    assert.string(weiAmount, 'Wei amount is required')
    assert.string(tokenAddress, 'Token address is required')
    assert.string(tokenAmount, 'Token amount is required')
    assert.string(expirationTime, 'Expiration time is required')
    assert.string(linkId, 'Link id is required')
    assert.string(linkdropMasterAddress, 'Linkdrop master address is requred')
    assert.string(
      linkdropSignerSignature,
      'Linkdrop signer signature is required'
    )
    assert.string(receiverAddress, 'Receiver address is required')
    assert.string(receiverSignature, 'Receiver signature is required')
    assert.string(campaignId, 'Campaign id is required')
    assert.string(owner, 'Owner is required')
    assert.string(name, 'Name is required')
    assert.integer(saltNonce, 'Salt nonce is required')

    const {
      success,
      txHash,
      safe,
      linkdropModule,
      errors
    } = await safeCreationService.claimAndCreate({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature,
      owner,
      name,
      saltNonce
    })

    res.json({
      success,
      txHash,
      safe,
      linkdropModule,
      errors
    })
  } catch (err) {
    next(err)
  }
})
