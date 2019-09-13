import { WalletSDK, LinkdropSDK } from '../../../sdk/src/index'
import { CHAIN } from '../../config/config.json'
import assert from 'assert-js'

class SDKService {
  constructor () {
    assert.string(CHAIN, 'Chain is required')
    this.walletSDK = new WalletSDK(CHAIN)
    this.LinkdropSDK = LinkdropSDK
  }
}

export default new SDKService()
