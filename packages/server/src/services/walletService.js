import { WalletSDK } from '@linkdrop/sdk'
import configs from '../../../../configs'
const config = configs.get('server')
const { CHAIN } = config

class WalletService {
  async getCreateWalletData ({ publicKey, initializeWithENS, signature }) {
    console.log('WalletService', {
      publicKey,
      initializeWithENS,
      signature
    })
    const walletSDK = new WalletSDK(CHAIN)
    return walletSDK.getCreateWalletData({
      publicKey,
      initializeWithENS,
      signature
    })
  }
}

export default new WalletService()
