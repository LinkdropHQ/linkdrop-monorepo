import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import { ethers } from 'ethers'
import assert from 'assert'
import relayerWalletService from './relayerWalletService'
import { WalletSDK } from '../../../sdk/src/index'
import logger from '../utils/logger'

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

const gnosisSafeMasterCopy = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A' // from https://safe-relay.gnosis.pm/api/v1/about/,
const proxyFactory = '0x12302fE9c02ff50939BaAaaf415fc226C078613C' // from https://safe-relay.gnosis.pm/api/v1/about/,

class SafeCreationService {
  constructor () {
    this.gnosisSafeMasterCopy = new ethers.Contract(
      gnosisSafeMasterCopy,
      GnosisSafe.abi,
      relayerWalletService.relayerWallet
    )

    this.proxyFactory = new ethers.Contract(
      proxyFactory,
      ProxyFactory.abi,
      relayerWalletService.relayerWallet
    )

    this.sdk = new WalletSDK()
  }

  async create ({ owner }) {
    try {
      logger.info('Creating new safe...')

      const gnosisSafeData = this.sdk.getData(
        this.gnosisSafeMasterCopy,
        'setup',
        [
          [owner],
          1, // threshold
          ADDRESS_ZERO, // to
          BYTES_ZERO, // data,
          ADDRESS_ZERO, // payment token address
          0, // payment amount
          ADDRESS_ZERO // payment receiver address
        ]
      )
      logger.debug(`gnosisSafeData: ${gnosisSafeData}`)

      const proxyCreationCode = await this.proxyFactory.proxyCreationCode()
      logger.debug(`proxyCreationCode: ${proxyCreationCode}`)

      const saltNonce = new Date().getTime()
      logger.debug(`saltNonce: ${saltNonce}`)

      const tx = await this.proxyFactory.createProxyWithNonce(
        this.gnosisSafeMasterCopy.address,
        gnosisSafeData,
        saltNonce,
        { gasLimit: 6500000, gasPrice: ethers.utils.parseUnits('10', 'gwei') }
      )
      logger.info('Waiting for confirmation...')
      logger.info(`Tx hash: ${tx.hash}`)
      tx.wait(1)

      const safeAddress = await this.sdk.getParamFromTxEvent(
        tx, // tx
        'ProxyCreation', // eventName
        'proxy', // paramName
        this.proxyFactory // contract
      )

      return { success: true, txHash: tx.hash, safeAddress }
    } catch (err) {
      return { success: false, errors: err }
    }
  }
}
