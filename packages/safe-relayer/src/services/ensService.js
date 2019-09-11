import assert from 'assert-js'
import { ethers } from 'ethers'
import { ENS, FIFSRegistrar } from '@ensdomains/ens'
import { ENS_ADDRESS } from '../../config/config.json'
import relayerWalletService from './relayerWalletService'

assert.string(ENS_ADDRESS, 'Please provide ens address of the network')

class ENSService {
  constructor () {
    this.ens = new ethers.Contract(
      ENS_ADDRESS,
      ENS.abi,
      relayerWalletService.wallet
    )
  }
}

export default new ENSService()
