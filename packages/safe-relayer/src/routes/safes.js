import express from 'express'
import safesController from '../controllers/safes'

const router = express.Router()

/**
 * @route POST api/safes
 * @desc Create new safe
 * @access Public
 */
router.post('/', safesController.createSafe)

export default router
