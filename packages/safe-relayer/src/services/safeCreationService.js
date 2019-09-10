import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import { ethers } from 'ethers'
import assert from 'assert'
import relayerWalletService from './relayerWalletService'
import { WalletSDK } from '../../../sdk/src/index'
import logger from '../utils/logger'

import {
  GNOSIS_SAFE_MASTER_COPY_ADDRESS,
  PROXY_FACTORY_ADDRESS
} from '../../config/config.json'

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

class SafeCreationService {
  constructor () {
    this.gnosisSafeMasterCopy = new ethers.Contract(
      GNOSIS_SAFE_MASTER_COPY_ADDRESS,
      GnosisSafe.abi,
      relayerWalletService.provider
    )

    this.proxyFactory = new ethers.Contract(
      PROXY_FACTORY_ADDRESS,
      ProxyFactory.abi,
      relayerWalletService.wallet
    )

    this.sdk = new WalletSDK()
  }

  async create ({ owner }) {
    try {
      logger.info('Creating new safe...')

      const gnosisSafeData = this.sdk.getEncodedData(GnosisSafe.abi, 'setup', [
        [owner], // owners
        1, // threshold
        ADDRESS_ZERO, // to
        BYTES_ZERO, // data,
        ADDRESS_ZERO, // payment token address
        0, // payment amount
        ADDRESS_ZERO // payment receiver address
      ])
      logger.debug(`gnosisSafeData: ${gnosisSafeData}`)

      const proxyCreationCode = await this.proxyFactory.proxyCreationCode()
      logger.debug(`proxyCreationCode: ${proxyCreationCode}`)

      const saltNonce = new Date().getTime()
      logger.debug(`saltNonce: ${saltNonce}`)

      const tx = await this.proxyFactory.createProxyWithNonce(
        this.gnosisSafeMasterCopy.address,
        gnosisSafeData,
        saltNonce,
        { gasLimit: 6500000, gasPrice: ethers.utils.parseUnits('20', 'gwei') }
      )

      const safe = await this.sdk.computeSafeAddress({
        owner,
        saltNonce,
        gnosisSafeMasterCopy: GNOSIS_SAFE_MASTER_COPY_ADDRESS,
        proxyFactory: PROXY_FACTORY_ADDRESS
      })

      logger.json({ txHash: tx.hash, safe })

      return { success: true, txHash: tx.hash, safe }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err }
    }
  }
}

export default new SafeCreationService()

// const main = async () => {
//   const sdk = new WalletSDK()

//   const res = await sdk.createSafe('0xA208969D8F9E443E2B497540d069a5d1a6878f4E')
//   logger.json(res)
// }
