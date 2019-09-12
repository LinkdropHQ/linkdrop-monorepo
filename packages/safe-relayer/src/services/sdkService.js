import { WalletSDK } from '../../../sdk/src/index'
import { CHAIN } from '../../config/config.json'
import assert from 'assert-js'

class SDKService {
  constructor () {
    assert.string(CHAIN, 'Chain is required')
    this.walletSDK = new WalletSDK(CHAIN)
  }
}

export default new SDKService()
