import express from 'express'
import * as linkdropsController from '../controllers/linkdrops'

const router = express.Router()

/**
 * @route POST api/v1/linkdrops/claim
 * @desc Claim ETH and/or ERC20
 * @access Public
 */
router.post('/claim', linkdropsController.claim)

/**
 * @route POST api/v1/linkdrops/claimERC721
 * @desc Claim ETH and/or ERC721
 * @access Public
 */
router.post('/claimERC721', linkdropsController.claimERC721)

export default router
