import LinkdropFactory from '@linkdrop/contracts/build/LinkdropFactory'
import { LINKDROP_FACTORY_ADDRESS } from '../../config/config.json'
import assert from 'assert-js'
import relayerWalletService from './relayerWalletService'
import { ethers } from 'ethers'

class LinkdropFactoryService {
  constructor () {
    assert.string(
      LINKDROP_FACTORY_ADDRESS,
      'Linkdrop factory address is required'
    )

    this.linkdropFactory = new ethers.Contract(
      LINKDROP_FACTORY_ADDRESS,
      LinkdropFactory.abi,
      relayerWalletService.provider
    )

    this.abi = LinkdropFactory.abi
  }
}

export default new LinkdropFactoryService()
