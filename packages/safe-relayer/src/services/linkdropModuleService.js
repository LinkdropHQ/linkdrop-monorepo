import LinkdropModule from '@linkdrop/safe-module-contracts/build/LinkdropModule'
import { ethers } from 'ethers'
import relayerWalletService from './relayerWalletService'

import logger from '../utils/logger'
import ClaimTx from '../models/claimTx'
import ClaimTxERC721 from '../models/claimTxERC721'

class LinkdropModuleService {
  async claim ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }) {
    try {
      const linkdropModule = new ethers.Contract(
        linkdropModuleAddress,
        LinkdropModule.abi,
        relayerWalletService.wallet
      )

      // Check whether a claim tx exists in database
      const oldClaimTx = await ClaimTx.findOne({
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkId,
        linkdropModuleAddress,
        receiverAddress
      })

      if (oldClaimTx && oldClaimTx.txHash) {
        logger.info('Submitted claim transaction')
        logger.info(`txHash: ${oldClaimTx.txHash}`)

        return {
          success: true,
          txHash: oldClaimTx.txHash
        }
      }

      logger.debug('Checking link params:')
      logger.json({
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

      // Check link params
      await linkdropModule.checkLinkParams(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkId,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature
      )
      logger.debug('Link params check passed succesfully...')

      logger.debug('Claiming...')
      // Claim
      const tx = await linkdropModule.claimLink(
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkId,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )

      // Save claim tx to database
      const claimTx = new ClaimTx({
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        linkId,
        linkdropModuleAddress,
        receiverAddress,
        txHash: tx.hash
      })

      const document = await claimTx.save()

      logger.info('Submitted claim transaction')
      logger.info(`txHash: ${tx.hash}`)

      return {
        success: true,
        txHash: tx.hash
      }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }

  async claimERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }) {
    try {
      const linkdropModule = new ethers.Contract(
        linkdropModuleAddress,
        LinkdropModule.abi,
        relayerWalletService.wallet
      )

      // Check whether a claim tx exists in database
      const oldClaimTx = await ClaimTxERC721.findOne({
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        linkId,
        linkdropModuleAddress,
        receiverAddress
      })

      if (oldClaimTx && oldClaimTx.txHash) {
        logger.info('Submitted claim transaction')
        logger.info(`txHash: ${oldClaimTx.txHash}`)

        return {
          success: true,
          txHash: oldClaimTx.txHash
        }
      }

      logger.debug('Checking link params:')
      logger.json({
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

      // Check link params
      await linkdropModule.checkLinkParams(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        linkId,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature
      )
      logger.debug('Link params check passed succesfully...')

      logger.debug('Claiming...')
      // Claim
      const tx = await linkdropModule.claimLink(
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        linkId,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        { gasLimit: 500000 }
      )

      // Save claim tx to database
      const claimTx = new ClaimTx({
        weiAmount,
        nftAddress,
        tokenId,
        expirationTime,
        linkId,
        linkdropModuleAddress,
        receiverAddress,
        txHash: tx.hash
      })

      const document = await claimTx.save()

      logger.info('Submitted claim transaction')
      logger.info(`txHash: ${tx.hash}`)

      return {
        success: true,
        txHash: tx.hash
      }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }
}

export default new LinkdropModuleService()
