import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import safeCreationService from '../services/safeCreationService'

export const createSafe = wrapAsync(async (req, res, next) => {
  try {
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
