import config from '../../config/config.json'

const {
  JSON_RPC_URL,
  RELAYER_PRIVATE_KEY,
  DEFAULT_GAS_PRICE,
  MAX_GAS_PRICE,
  CHAIN
} = config
const ethers = require('ethers')
ethers.errors.setLogLevel('error')

if (JSON_RPC_URL == null || JSON_RPC_URL === '') {
  throw new Error('Please provide json rpc url')
}

if (RELAYER_PRIVATE_KEY == null || RELAYER_PRIVATE_KEY === '') {
  throw new Error('Please provide relayer private key')
}

if (CHAIN == null || CHAIN === '') {
  throw new Error('Please provide chain')
}

class RelayerWalletService {
  constructor () {
    this.provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)
    this.relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, this.provider)
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
