/* eslint-disable no-undef */
import config from '../../config/config.json'
import { BigNumber } from 'bignumber.js'

const terminalSDK = require('@terminal-packages/sdk')

const {
  JSON_RPC_URL,
  RELAYER_PRIVATE_KEY,
  DEFAULT_GAS_PRICE,
  MAX_GAS_PRICE,
  CHAIN,
  K,
  C
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

class AutoNonceWallet extends ethers.Wallet {
  sendTransaction (transaction) {
    if (transaction.nonce == null) {
      if (this._noncePromise == null) {
        this._noncePromise = this.provider.getTransactionCount(this.address)
      }
      transaction.nonce = this._noncePromise
      this._noncePromise = this._noncePromise.then(nonce => nonce + 1)
    }
    return super.sendTransaction(transaction)
  }
}

class RelayerWalletService {
  constructor () {
    this.provider = new ethers.providers.Web3Provider(
      new terminalSDK.TerminalHttpProvider({
        host: JSON_RPC_URL,
        apiKey: config.TERMINAL_API_KEY,
        projectId: config.TERMINAL_PROJECT_ID,
        source: terminalSDK.SourceType.Infura
      })
    )
    this.relayerWallet = new AutoNonceWallet(RELAYER_PRIVATE_KEY, this.provider)
    this.chain = CHAIN
  }

  async getGasPrice () {
    let gasPrice

    if (!DEFAULT_GAS_PRICE || DEFAULT_GAS_PRICE === 'auto') {
      let currentGasPrice = await this.provider.getGasPrice()

      if (K != null && K !== '' && C != null && C !== '') {
        currentGasPrice = BigNumber(currentGasPrice)
        currentGasPrice = currentGasPrice.multipliedBy(BigNumber(K))
        currentGasPrice = currentGasPrice.plus(
          BigNumber(ethers.utils.parseUnits(C, 'gwei'))
        )
        currentGasPrice = ethers.utils.bigNumberify(currentGasPrice.toString())
      }

      gasPrice = Math.min(
        currentGasPrice,
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
