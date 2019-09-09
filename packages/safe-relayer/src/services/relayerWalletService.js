import assert from 'assert'
import { ethers } from 'ethers'
const { JSON_RPC_URL, RELAYER_PRIVATE_KEY } = '../../config/config.json'

assert(JSON_RPC_URL && JSON_RPC_URL !== '', 'Please provide json rpc url')
assert(
  RELAYER_PRIVATE_KEY && RELAYER_PRIVATE_KEY !== '',
  'Please provide relayer private key'
)

class RelayerWalletService {
  constructor () {
    this.provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)
    this.relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, this.provider)
  }
}

export default new RelayerWalletService()
