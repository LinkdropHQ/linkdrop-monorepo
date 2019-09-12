import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import safeCreationService from '../services/safeCreationService'

export const create = wrapAsync(async (req, res, next) => {
  try {
    logger.info('POST api/v1/safes/create')
    logger.json(req.body, 'info')

    const { owner } = req.body
    assert.string(owner, 'Owner is required')

    const { success, txHash, safe, errors } = await safeCreationService.create({
      owner
    })

    res.json({
      success,
      txHash,
      safe,
      errors
    })
  } catch (err) {
    next(err)
  }
})

export const createWithENS = wrapAsync(async (req, res, next) => {
  try {
    logger.info('POST api/v1/safes/createWithENS')
    logger.json(req.body, 'info')

    const { owner, name } = req.body
    assert.string(owner, 'Owner is required')
    assert.string(name, 'Name is required')

    const {
      success,
      txHash,
      safe,
      errors
    } = await safeCreationService.createWithENS({
      owner,
      name
    })

    res.json({
      success,
      txHash,
      safe,
      errors
    })
  } catch (err) {
    next(err)
  }
})
