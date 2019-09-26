import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import transactionRelayService from '../services/transactionRelayService'

export const executeTx = wrapAsync(async (req, res, next) => {
  try {
    logger.info('POST api/v1/safes/execute')
    logger.json(req.body, 'info')

    const {
      safe,
      to,
      value,
      data,
      operation,
      gasToken,
      refundReceiver,
      gasSpectrum
    } = req.body

    assert.string(safe, 'Safe address is required')
    assert.string(to, 'To is required')
    assert.number(value, 'Value is required')
    assert.string(data, 'Data is required')
    assert.string(gasToken, 'Gas token is required')
    assert.string(refundReceiver, 'Refund receiver address is required')
    assert.object(gasSpectrum, 'Gas spectrum is required')

    const { success, txHash, errors } = await transactionRelayService.executeTx(
      {
        safe,
        to,
        value,
        data,
        operation,
        gasToken,
        refundReceiver,
        gasSpectrum
      }
    )

    res.json({
      success,
      txHash,
      errors
    })
  } catch (err) {
    next(err)
  }
})
