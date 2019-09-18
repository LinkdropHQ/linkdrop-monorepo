import { ethers, utils } from 'ethers'
import logger from '../utils/logger'
import boom from '@hapi/boom'
import assert from 'assert-js'
import wrapAsync from '../utils/asyncWrapper'
import linkdropModuleService from '../services/linkdropModuleService'

export const claim = wrapAsync(async (req, res, next) => {
  try {
    logger.info('POST api/v1/linkdrops/claim')
    logger.json(req.body, 'info')

    const {
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    } = req.body

    assert.string(weiAmount, 'Wei amount is required')
    assert.string(tokenAddress, 'Token address is required')
    assert.string(tokenAmount, 'Token amount is required')
    assert.string(expirationTime, 'Expiration time is required')
    assert.string(linkId, 'Link id is required')
    assert.string(linkdropModuleAddress, 'Linkdrop module address is requred')
    assert.string(
      linkdropSignerSignature,
      'Linkdrop signer signature is required'
    )
    assert.string(receiverAddress, 'Receiver address is required')
    assert.string(receiverSignature, 'Receiver signature is required')

    const { success, txHash, errors } = await linkdropModuleService.claim({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })

    res.json({
      success,
      txHash,
      errors
    })
  } catch (err) {
    next(err)
  }
})

export const claimERC721 = wrapAsync(async (req, res, next) => {
  try {
    logger.info('POST api/v1/linkdrops/claimERC721')
    logger.json(req.body, 'info')

    const {
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    } = req.body

    assert.string(weiAmount, 'Wei amount is required')
    assert.string(nftAddress, 'NFT address is required')
    assert.string(tokenId, 'Token id is required')
    assert.string(expirationTime, 'Expiration time is required')
    assert.string(linkId, 'Link id is required')
    assert.string(linkdropModuleAddress, 'Linkdrop module address is requred')
    assert.string(
      linkdropSignerSignature,
      'Linkdrop signer signature is required'
    )
    assert.string(receiverAddress, 'Receiver address is required')
    assert.string(receiverSignature, 'Receiver signature is required')

    const { success, txHash, errors } = await linkdropModuleService.claim({
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })

    res.json({
      success,
      txHash,
      errors
    })
  } catch (err) {
    next(err)
  }
})
