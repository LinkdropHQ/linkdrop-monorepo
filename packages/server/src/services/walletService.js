import { WalletSDK } from '@linkdrop/sdk'
import configs from '../../../../configs'
const config = configs.get('server')
const { CHAIN } = config

class WalletService {
  async getCreateWalletData ({ publicKey, ensName, gasPrice }) {
    const walletSDK = new WalletSDK(CHAIN)
    return walletSDK.getCreateWalletData({ publicKey, ensName, gasPrice })
  }
}

export default new WalletService()
