import LinkdropSDK from '../../../sdk/src/index'
import configs from '../../../../configs'
import Linkdrop from '../../../contracts/build/ILinkdrop'
import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import relayerWalletService from './relayerWalletService'
import utilsService from './utilsService'
import { ethers } from 'ethers'
import logger from '../utils/logger'
import Deploy from '../models/Deploy'

const config = configs.get('server')

class FactoryService {
  constructor () {
    this.factory = new ethers.Contract(
      config.FACTORY_ADDRESS,
      LinkdropFactory.abi,
      relayerWalletService.relayerWallet
    )

    this.multiSend = new ethers.Contract(
      config.MULTISEND_ADDRESS,
      ['function multiSend(bytes)'],
      relayerWalletService.relayerWallet
    )
  }

  async isDeployed (senderAddress, campaignId) {
    return this.factory['isDeployed(address,uint256)'](
      senderAddress,
      campaignId
    )
  }

  async deploy ({ senderAddress }) {
    if (this.isDeployed(senderAddress, 0) === true) {
      throw new Error('Proxy is already deployed')
    }

    const gasPrice = await relayerWalletService.getGasPrice()

    const linkdropSDK = new LinkdropSDK({
      senderAddress,
      factoryAddress: this.factory.address,
      chain: relayerWalletService.chain
    })

    const linkdropContractAddress = linkdropSDK.getProxyAddress()

    logger.debug(
      `Deploying campaign 0 for ${senderAddress} at address ${linkdropContractAddress}`
    )

    const tx = await this.factory['deployProxy(address,uint256)'](
      senderAddress,
      0,
      {
        gasPrice
      }
    )

    const deploy = await Deploy.findOne({
      senderAddress,
      linkdropContractAddress
    })
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
    senderAddress
  }) {
    logger.json({
      linkParams,
      receiverAddress,
      receiverSignature,
      linkdropContractAddress,
      senderAddress
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
      this.factory.address,
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
