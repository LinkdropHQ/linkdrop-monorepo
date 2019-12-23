import LinkdropSDK from '../../../sdk/src/index'
import configs from '../../../../configs'
import Linkdrop from '../../../contracts/build/Linkdrop'
import relayerWalletService from './relayerWalletService'
import factoryService from './factoryService'
import Deploy from '../models/Deploy'
import { ethers } from 'ethers'
import logger from '../utils/logger'
const config = configs.get('server')

class LinkdropService {
  async checkClaimParams ({
    linkParams,
    receiverAddress,
    receiverSignature,
    linkdropContractAddress
  }) {
    const linkdropContract = new ethers.Contract(
      linkdropContractAddress,
      Linkdrop.abi,
      relayerWalletService.relayerWallet
    )
    return linkdropContract.checkClaimParams(
      linkParams,
      receiverAddress,
      receiverSignature
    )
  }

  async claim ({
    linkParams,
    receiverAddress,
    receiverSignature,
    linkdropContractAddress
  }) {
    const linkdropContract = new ethers.Contract(
      linkdropContractAddress,
      Linkdrop.abi,
      relayerWalletService.relayerWallet
    )

    const gasPrice = await relayerWalletService.getGasPrice()

    return linkdropContract.claim(
      linkParams,
      receiverAddress,
      receiverSignature,
      { gasPrice }
    )
  }

  async register ({ senderAddress, factoryAddress, campaignId = 0 }) {
    const linkdropSDK = new LinkdropSDK({
      senderAddress,
      factoryAddress,
      chain: relayerWalletService.chain
    })
    const linkdropContractAddress = linkdropSDK.getProxyAddress(campaignId)

    let deploy = await Deploy.findOne({
      senderAddress,
      linkdropContractAddress,
      factoryAddress,
      campaignId
    })

    if (deploy) {
      return false
    }

    deploy = new Deploy({
      senderAddress,
      linkdropContractAddress,
      factoryAddress,
      campaignId
    })

    await deploy.save()

    logger.debug('Saved deploy data in database:')
    logger.json(deploy)
    return true
  }

  async withdraw ({ linkdropContractAddress }) {
    const deploy = await Deploy.findOne({
      linkdropContractAddress
    })

    if (deploy.deployedAt + 1000 * 60 * 60 * 24 * 7 >= new Date().getTime()) {
      throw new Error('Timelock not passed')
    }

    const linkdropContract = new ethers.Contract(
      linkdropContractAddress,
      Linkdrop.abi,
      relayerWalletService.relayerWallet
    )

    const gasPrice = await relayerWalletService.getGasPrice()
    const tx = linkdropContract.withdraw({ gasPrice })

    await tx.wait()
    const txReceipt = await relayerWalletService.provider.getTransactionReceipt(
      tx.hash
    )
    const status = txReceipt.status

    if (status === 1) {
      deploy.isWithdrawn = true
      await deploy.save()
      logger.debug('Updated deploy data in database:')
      logger.json(deploy)
    }

    return tx.hash
  }
}

export default new LinkdropService()
