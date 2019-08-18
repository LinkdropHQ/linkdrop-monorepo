import WalletFactory from '@linkdrop/contracts/metadata/WalletFactory'
import relayerWalletService from './relayerWalletService'
import configs from '../../../../configs'
import logger from '../utils/logger'
const config = configs.get('server')
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

class WalletFactoryService {
  constructor () {
    // initialize proxy factory
    this.contract = new ethers.Contract(
      config.WALLET_FACTORY_ADDRESS,
      WalletFactory.abi,
      relayerWalletService.relayerWallet
    )
  }

  async claimAndDeploy ({ claimData, publicKey, initializeWithENS, signature }) {
    const gasPrice = await relayerWalletService.getGasPrice()

    return this.contract.claimAndDeploy(
      claimData,
      publicKey,
      initializeWithENS,
      signature,
      { gasPrice }
    )
  }
}

export default new WalletFactoryService()
