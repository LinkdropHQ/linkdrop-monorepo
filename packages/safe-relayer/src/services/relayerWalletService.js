import assert from 'assert'
import { ethers } from 'ethers'

import {
  CHAIN,
  INFURA_API_TOKEN,
  RELAYER_PRIVATE_KEY
} from '../../config/config.json'

assert(CHAIN && CHAIN !== '', 'Please provide chain')
assert(
  RELAYER_PRIVATE_KEY && RELAYER_PRIVATE_KEY !== '',
  'Please provide relayer private key'
)

class RelayerWalletService {
  constructor () {
    this.chain = CHAIN
    this.jsonRpcUrl = 'https://rinkeby.infura.io'
    // INFURA_API_TOKEN && INFURA_API_TOKEN !== ''
    //   ? `https://${this.chain}.infura.io/v3/${INFURA_API_TOKEN}`
    //   : `https://${this.chain}.infura.io`
    this.provider = new ethers.providers.JsonRpcProvider(this.jsonRpcUrl)
    this.wallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, this.provider)
  }
}

export default new RelayerWalletService()
