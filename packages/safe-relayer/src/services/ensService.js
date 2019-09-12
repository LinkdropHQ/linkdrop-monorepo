import assert from 'assert-js'
import { ethers } from 'ethers'
import { ENS, FIFSRegistrar } from '@ensdomains/ens'
import { ENS_ADDRESS } from '../../config/config.json'
import relayerWalletService from './relayerWalletService'
import sdkService from './sdkService'

class ENSService {
  constructor () {
    assert.string(ENS_ADDRESS, 'Please provide ens address of the network')

    this.ens = new ethers.Contract(
      ENS_ADDRESS,
      ENS.abi,
      relayerWalletService.wallet
    )
  }

  async getOwner (name) {
    return sdkService.walletSDK.getEnsOwner(name)
  }
}

export default new ENSService()
