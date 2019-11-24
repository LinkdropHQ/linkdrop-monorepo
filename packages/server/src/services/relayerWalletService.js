import configs from '../../../../configs'
const config = configs.get('server')
const {
  jsonRpcUrl,
  relayerPrivateKey,
  DEFAULT_GAS_PRICE,
  MAX_GAS_PRICE,
  CHAIN
} = config
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

// #TODO move to special function
if (jsonRpcUrl == null || jsonRpcUrl === '') {
  throw new Error('Please provide json rpc url')
}

if (relayerPrivateKey == null || relayerPrivateKey === '') {
  throw new Error('Please provide relayer private key')
}

if (CHAIN == null || CHAIN === '') {
  throw new Error('Please provide chain')
}

class RelayerWalletService {
  constructor () {
    this.provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    this.relayerWallet = new ethers.Wallet(relayerPrivateKey, this.provider)
    this.chain = CHAIN
  }

  async getGasPrice () {
    let gasPrice

    if (!DEFAULT_GAS_PRICE || DEFAULT_GAS_PRICE === 'auto') {
      gasPrice = Math.min(
        await this.provider.getGasPrice(),
        ethers.utils.parseUnits(MAX_GAS_PRICE, 'gwei')
      )
    } else {
      gasPrice = Math.min(
        ethers.utils.parseUnits(DEFAULT_GAS_PRICE, 'gwei'),
        ethers.utils.parseUnits(MAX_GAS_PRICE, 'gwei')
      )
    }
    return gasPrice
  }
}

export default new RelayerWalletService()
