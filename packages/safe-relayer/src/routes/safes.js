import express from 'express'
import * as safesController from '../controllers/safes'

const router = express.Router()

/**
 * @route POST api/v1/safes/
 * @desc Create new safe
 * @access Public
 */
router.post('/', safesController.create)

/**
 * @route POST api/v1/safes/claimAndCreate
 * @desc Claim linkdrop, create new safe and initialize it with ens name
 * @access Public
 */
router.post('/claimAndCreate', safesController.claimAndCreate)

export default router
