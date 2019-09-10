import express from 'express'
import * as transactionsController from '../controllers/transactions'

const router = express.Router()

/**
 * @route POST api/v1/safes/execute
 * @desc Execute safe transaction
 * @access Public
 */
router.post('/', transactionsController.executeTx)

export default router
