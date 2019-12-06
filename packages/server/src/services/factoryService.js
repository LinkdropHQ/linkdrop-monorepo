import LinkdropSDK from '../../../sdk/src/index'

import Linkdrop from '../../../contracts/build/ILinkdrop'
import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import relayerWalletService from './relayerWalletService'
import utilsService from './utilsService'
import { ethers } from 'ethers'
import logger from '../utils/logger'
import Deploy from '../models/Deploy'
import config from '../../config/config.json'

class FactoryService {
  constructor () {
    this.multiSend = new ethers.Contract(
      config.MULTISEND_ADDRESS,
      ['function multiSend(bytes)'],
      relayerWalletService.relayerWallet
    )
  }

  async isDeployed ({ senderAddress, campaignId, factoryAddress }) {
    const factoryContract = new ethers.Contract(
      factoryAddress,
      LinkdropFactory.abi,
      relayerWalletService.relayerWallet
    )
    return factoryContract['isDeployed(address,uint256)'](
      senderAddress,
      campaignId
    )
  }

  async deploy ({ senderAddress, campaignId, factoryAddress }) {
    if (
      this.isDeployed({ senderAddress, campaignId, factoryAddress }) === true
    ) {
      throw new Error('Linkdrop contract is already deployed')
    }

    const gasPrice = await relayerWalletService.getGasPrice()

    const linkdropSDK = new LinkdropSDK({
      senderAddress,
      factoryAddress,
      chain: relayerWalletService.chain
    })

    const linkdropContractAddress = linkdropSDK.getProxyAddress(campaignId)

    const factoryContract = new ethers.Contract(
      factoryAddress,
      LinkdropFactory.abi,
      relayerWalletService.relayerWallet
    )

    logger.debug(
      `Deploying campaign ${campaignId} for ${senderAddress} at address ${linkdropContractAddress}`
    )

    const tx = await factoryContract['deployProxy(address,uint256)'](
      senderAddress,
      campaignId,
      {
        gasPrice
      }
    )

    let deploy = await Deploy.findOne({
      senderAddress,
      linkdropContractAddress,
      factoryAddress,
      campaignId
    })

    if (!deploy) {
      deploy = new Deploy({
        senderAddress,
        linkdropContractAddress,
        campaignId,
        factoryAddress
      })
    }

    deploy.deployedAt = new Date().getTime()
    await deploy.save()

    logger.debug('Updated deploy data in database:')
    logger.json(deploy)

    return tx.hash
  }

  async claimAndDeploy ({
    linkParams,
    receiverAddress,
    receiverSignature,
    linkdropContractAddress,
    senderAddress,
    factoryAddress
  }) {
    logger.json({
      linkParams,
      receiverAddress,
      receiverSignature,
      linkdropContractAddress,
      senderAddress,
      factoryAddress
    })

    const gasPrice = await relayerWalletService.getGasPrice()
    logger.debug(
      `Deploying campaign 0 for ${senderAddress} at address ${linkdropContractAddress}`
    )

    const deployProxyData = utilsService.encodeParams(
      LinkdropFactory.abi,
      'deployProxy(address,uint256)',
      [senderAddress, 0]
    )

    const deployProxyMultiSendData = utilsService.encodeDataForMultiSend(
      0, // CALL OP
      factoryAddress,
      0,
      deployProxyData
    )

    const claimData = utilsService.encodeParams(Linkdrop.abi, 'claim', [
      linkParams,
      receiverAddress,
      receiverSignature
    ])

    const claimMultiSendData = utilsService.encodeDataForMultiSend(
      0,
      linkdropContractAddress,
      0,
      claimData
    )

    const nestedTxData = '0x' + deployProxyMultiSendData + claimMultiSendData

    return this.multiSend.multiSend(nestedTxData, {
      gasPrice
    })
  }
}

export default new FactoryService()
