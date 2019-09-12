import express from 'express'
import * as safesController from '../controllers/safes'

const router = express.Router()

/**
 * @route POST api/v1/safes/create
 * @desc Create new safe
 * @access Public
 */
router.post('/create', safesController.create)

/**
 * @route POST api/v1/safes/createWithENS
 * @desc Create new safe and initialize with ens name
 * @access Public
 */
router.post('/createWithENS', safesController.createWithENS)

export default router
