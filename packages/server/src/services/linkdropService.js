import LinkdropSDK from '../../../sdk/src/index'
import configs from '../../../../configs'
import Linkdrop from '../../../contracts/build/Linkdrop'
import relayerWalletService from './relayerWalletService'
import { ethers } from 'ethers'
const config = configs.get('server')

class LinkdropService {
  async checkClaimParams ({
    linkParams,
    receiverAddress,
    receiverSignature,
    linkdropContractAddress
  }) {
    const linkdropContract = new ethers.Contract(
      linkdropContractAddress,
      Linkdrop.abi,
      relayerWalletService.relayerWallet
    )
    return linkdropContract.checkClaimParams(
      linkParams,
      receiverAddress,
      receiverSignature
    )
  }

  async claim ({
    linkParams,
    receiverAddress,
    receiverSignature,
    linkdropContractAddress
  }) {
    const linkdropContract = new ethers.Contract(
      linkdropContractAddress,
      Linkdrop.abi,
      relayerWalletService.relayerWallet
    )

    const gasPrice = await relayerWalletService.getGasPrice()

    return linkdropContract.claim(
      linkParams,
      receiverAddress,
      receiverSignature,
      { gasPrice }
    )
  }
}

export default new LinkdropService()
