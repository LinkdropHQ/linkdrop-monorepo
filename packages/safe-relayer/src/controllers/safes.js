import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import wrapAsync from '../utils/asyncWrapper'
import safeCreationService from '../services/safeCreationService'

const createSafe = wrapAsync(async (req, res, next) => {
  try {
    const { owner } = req.body

    const {
      success,
      txHash,
      safeAddress,
      errors
    } = await safeCreationService.create({ owner })

    res.json({
      success,
      txHash,
      safeAddress,
      errors
    })
  } catch (err) {
    next(err)
  }
})

export default { createSafe }
