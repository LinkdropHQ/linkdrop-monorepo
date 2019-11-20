import LinkdropSDK from '../../../sdk/src/index'
import configs from '../../../../configs'
import Linkdrop from '../../../contracts/build/ILinkdrop'
import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import relayerWalletService from './relayerWalletService'
import utilsService from './utilsService'
import { ethers } from 'ethers'
import logger from '../utils/logger'

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
    logger.error('FUCK')
    const isDeployed = await this.factory['isDeployed(address,uint256)'](
      senderAddress,
      campaignId
    )
    console.log(isDeployed)

    const addr = await this.factory.getProxyAddress(senderAddress, campaignId)
    console.log('addr: ', addr)
    return isDeployed
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
      `🚨🚨🚨Deploying campaign 0 for ${senderAddress} at address ${linkdropContractAddress}`
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
