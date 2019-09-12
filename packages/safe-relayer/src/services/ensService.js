import assert from 'assert-js'
import { ethers } from 'ethers'
import { ENS, FIFSRegistrar } from '@ensdomains/ens'
import { ENS_ADDRESS, ENS_DOMAIN } from '../../config/config.json'
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
    return sdkService.walletSDK.getEnsOwner({
      name: `${name}.${ENS_DOMAIN}`,
      chain: relayerWalletService.chain,
      jsonRpcUrl: relayerWalletService.jsonRpcUrl
    })
  }

  async getRegistrarContract () {
    assert.string(ENS_DOMAIN, 'Ens domain is required')
    const registrar = await this.getOwner(ENS_DOMAIN)
    return new ethers.Contract(
      registrar,
      FIFSRegistrar.abi,
      relayerWalletService.provider
    )
  }
}

export default new ENSService()
