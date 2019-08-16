import { WalletSDK } from '@linkdrop/sdk'
import configs from '../../../../configs'
const config = configs.get('server')
const { CHAIN } = config

class WalletService {
  async getClaimData ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress,
    receiverSignature
  }) {
    console.log('WalletService', {
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })
    const walletSDK = new WalletSDK(CHAIN)
    return walletSDK.getClaimData({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId,
      linkdropMasterAddress,
      campaignId,
      linkdropSignerSignature,
      receiverAddress,
      receiverSignature
    })
  }
}

export default new WalletService()
