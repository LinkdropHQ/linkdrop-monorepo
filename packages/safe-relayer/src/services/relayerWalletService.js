import assert from 'assert-js'
import { ethers } from 'ethers'

import {
  CHAIN,
  INFURA_API_TOKEN,
  RELAYER_PRIVATE_KEY
} from '../../config/config.json'

assert.string(CHAIN, 'Please provide chain')
assert.string(RELAYER_PRIVATE_KEY, 'Please provide relayer private key')

class RelayerWalletService {
  constructor () {
    this.chain = CHAIN
    this.jsonRpcUrl =
      INFURA_API_TOKEN && INFURA_API_TOKEN !== ''
        ? `https://${this.chain}.infura.io/v3/${INFURA_API_TOKEN}`
        : `https://${this.chain}.infura.io`
    this.provider = new ethers.providers.JsonRpcProvider(this.jsonRpcUrl)
    this.wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, this.provider)
  }
}

export default new RelayerWalletService()
