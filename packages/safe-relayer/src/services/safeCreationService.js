import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import MultiSend from '@gnosis.pm/safe-contracts/build/contracts/MultiSend'
import { ethers } from 'ethers'
import assert from 'assert-js'
import relayerWalletService from './relayerWalletService'
import logger from '../utils/logger'
import { ENS, FIFSRegistrar } from '@ensdomains/ens'
import sdkService from './sdkService'
import ensService from './ensService'

import {
  GNOSIS_SAFE_MASTER_COPY_ADDRESS,
  PROXY_FACTORY_ADDRESS,
  MULTISEND_LIBRARY_ADDRESS
} from '../../config/config.json'

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

const CALL_OP = 0
const DELEGATECALL_OP = 1

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

    this.multiSend = new ethers.Contract(
      MULTISEND_LIBRARY_ADDRESS,
      MultiSend.abi,
      relayerWalletService.provider
    )
  }

  async create ({ owner }) {
    try {
      logger.info('Creating new safe...')

      const gnosisSafeData = this.sdk.encodeParams(GnosisSafe.abi, 'setup', [
        [owner], // owners
        1, // threshold
        ADDRESS_ZERO, // to
        BYTES_ZERO, // data,
        ADDRESS_ZERO, // payment token address
        0, // payment amount
        ADDRESS_ZERO // payment receiver address
      ])
      logger.debug(`gnosisSafeData: ${gnosisSafeData}`)

      const saltNonce = new Date().getTime()
      logger.debug(`saltNonce: ${saltNonce}`)

      const tx = await this.proxyFactory.createProxyWithNonce(
        this.gnosisSafeMasterCopy.address,
        gnosisSafeData,
        saltNonce,
        { gasLimit: 6500000, gasPrice: ethers.utils.parseUnits('20', 'gwei') }
      )

      const safe = await sdkService.walletSDK.computeSafeAddress({
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

  async createWithENS ({ owner, name }) {
    try {
      logger.info('Creating new safe with ENS...')

      const gnosisSafeData = this.sdk.encodeParams(GnosisSafe.abi, 'setup', [
        [owner], // owners
        1, // threshold
        ADDRESS_ZERO, // to
        BYTES_ZERO, // data,
        ADDRESS_ZERO, // payment token address
        0, // payment amount
        ADDRESS_ZERO // payment receiver address
      ])
      logger.debug(`gnosisSafeData: ${gnosisSafeData}`)

      const saltNonce = new Date().getTime()
      logger.debug(`saltNonce: ${saltNonce}`)

      const safe = await sdkService.walletSDK.computeSafeAddress({
        owner,
        saltNonce,
        gnosisSafeMasterCopy: GNOSIS_SAFE_MASTER_COPY_ADDRESS,
        proxyFactory: PROXY_FACTORY_ADDRESS
      })
      logger.debug(`Computed safe address: ${safe}`)

      const createSafeData = sdkService.walletSDK.encodeParams(
        ProxyFactory.abi,
        'createProxyWithNonce',
        [this.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
      )
      logger.debug(`createSafeData: ${createSafeData}`)

      const createSafeMultiSendData = sdkService.walletSDK.encodeDataForMultiSend(
        CALL_OP,
        this.proxyFactory.address,
        0,
        createSafeData
      )
      logger.debug(`createSafeMultiSendData: ${createSafeMultiSendData}`)

      const registrar = await ensService.getRegistrarContract()

      const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name))
      logger.debug(`label: ${label}`)

      const registerEnsData = sdkService.walletSDK.encodeParams(
        FIFSRegistrar.abi,
        'register',
        [label, safe]
      )
      logger.debug(`registerEnsData: ${registerEnsData}`)

      const registerEnsMultiSendData = sdkService.walletSDK.encodeData(
        CALL_OP,
        registrar.address,
        0,
        registerEnsData
      )
      logger.debug(`registerEnsMultiSendData: ${registerEnsMultiSendData}`)

      const nestedTxData =
        '0x' + createSafeMultiSendData + registerEnsMultiSendData
      logger.debug(`nestedTxData: ${nestedTxData}`)

      const multiSendData = sdkService.walletSDK.encodeParams(
        MultiSend.abi,
        'multiSend',
        [nestedTxData]
      )
      logger.debug(`multiSendData: ${multiSendData}`)

      const tx = await relayerWalletService.wallet.sendTransaction({
        to: this.multiSend.address,
        data: multiSendData,
        gasPrice: ethers.utils.parseUnits('20', 'gwei'),
        gasLimit: 6500000
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
//   const ensAddr = '0xe7410170f87102df0055eb195163a03b7f2bff4a'
//   const ensContract = new ethers.Contract(
//     ensAddr,
//     ENS.abi,
//     relayerWalletService.wallet
//   )

//   const node = ethers.utils.namehash('linkdrop.test')

//   console.log('node: ', node)
//   const registrarAddr = await ensContract.owner(node)
//   console.log('registrarAddr: ', registrarAddr)

//   const registrarContract = new ethers.Contract(
//     registrarAddr,
//     FIFSRegistrar.abi,
//     relayerWalletService.wallet
//   )

//   const hex = ethers.utils.toUtf8Bytes('safe')
//   const label = ethers.utils.keccak256(hex)
//   console.log('label: ', label)

//   /// /////
//   const service = new SafeCreationService()

//   const saltNonce = 90495045
//   console.log('saltNonce: ', saltNonce)
//   const owner = '0x9b5FEeE3B220eEdd3f678efa115d9a4D91D5cf0A'
//   console.log('owner: ', owner)

//   const gnosisSafeData = sdkService.walletSDK.encodeParams(
//     GnosisSafe.abi,
//     'setup',
//     [
//       [owner], // owners
//       1, // threshold
//       ADDRESS_ZERO, // to
//       BYTES_ZERO, // data,
//       ADDRESS_ZERO, // payment token address
//       0, // payment amount
//       ADDRESS_ZERO // payment receiver address
//     ]
//   )
//   logger.debug(`gnosisSafeData: ${gnosisSafeData}`)

//   const createProxyData = sdkService.walletSDK.encodeParams(
//     ProxyFactory.abi,
//     'createProxyWithNonce',
//     [service.gnosisSafeMasterCopy.address, gnosisSafeData, saltNonce]
//   )
//   logger.debug(`createProxyData: ${createProxyData}`)

//   const createSafeTxData = sdkService.walletSDK.encodeData(
//     CALL_OP,
//     service.proxyFactory.address,
//     0,
//     createProxyData
//   )
//   logger.debug(`createSafeTxData: ${createSafeTxData}`)

//   //

//   const safeAddr = await sdkService.walletSDK.computeSafeAddress({
//     owner,
//     saltNonce,
//     gnosisSafeMasterCopy: service.gnosisSafeMasterCopy.address,
//     proxyFactory: service.proxyFactory.address
//   })
//   logger.info(safeAddr)

//   // const tx = await registrarContract.register(
//   //   label,
//   //   '0xA208969D8F9E443E2B497540d069a5d1a6878f4E'
//   // )

//   const registerEnsData = sdkService.walletSDK.encodeParams(
//     FIFSRegistrar.abi,
//     'register',
//     [label, safeAddr]
//   )
//   logger.debug(`registerEnsData: ${registerEnsData}`)

//   const registerEnsTxData = sdkService.walletSDK.encodeData(
//     CALL_OP,
//     registrarContract.address,
//     0,
//     registerEnsData
//   )
//   logger.debug(`registerEnsTxData: ${registerEnsTxData}`)

//   const nestedTxData = '0x' + createSafeTxData + registerEnsTxData
//   logger.debug(`nestedTxData: ${nestedTxData}`)

//   const data = sdkService.walletSDK.encodeParams(MultiSend.abi, 'multiSend', [
//     nestedTxData
//   ])
//   logger.debug(`data: ${data}`)

//   const tx = await relayerWalletService.wallet.sendTransaction({
//     to: service.multiSend.address,
//     data,
//     gasPrice: ethers.utils.parseUnits('30', 'gwei'),
//     gasLimit: 6500000
//   })
//   console.log('tx: ', tx.hash)
// }

// main()
