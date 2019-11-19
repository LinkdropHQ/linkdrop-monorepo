import LinkdropSDK from '../../../sdk/src/index'
import configs from '../../../../configs'
import LinkdropFactory from '../../../contracts/build/LinkdropFactory'
import relayerWalletService from './relayerWalletService'
import { ethers } from 'ethers'
import logger from '../utils/logger'
const config = configs.get('server')

class FactoryService {
  constructor () {
    this.contract = new ethers.Contract(
      config.FACTORY_ADDRESS,
      LinkdropFactory.abi,
      relayerWalletService.relayerWallet
    )
  }

  async isDeployed (senderAddress, campaignId) {
    return this.contract['isDeployed(address,uint256)'](
      senderAddress,
      campaignId
    )
  }

  async deploy ({ senderAddress, campaignId }) {
    const gasPrice = await relayerWalletService.getGasPrice()
    logger.debug(`Deploying campaign ${campaignId} for ${senderAddress}`)
    const tx = await this.contract['deployProxy(address,uint256)'](
      senderAddress,
      campaignId,
      {
        gasPrice
      }
    )

    return tx.hash
  }
}

export default new FactoryService()
