import express from 'express'
import * as safesController from '../controllers/safes'

const router = express.Router()

/**
 * @route POST api/v1/safes
 * @desc Create new safe
 * @access Public
 */
router.post('/', safesController.createSafe)

export default router
