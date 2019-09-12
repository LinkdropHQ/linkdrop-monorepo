import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import { ethers } from 'ethers'
import assert from 'assert'
import relayerWalletService from './relayerWalletService'
import logger from '../utils/logger'

class TransactionRelayService {
  async executeTx ({
    safe,
    to,
    value,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    signature
  }) {
    try {
      const gnosisSafe = new ethers.Contract(
        safe,
        GnosisSafe.abi,
        relayerWalletService.wallet
      )

      logger.debug('Submitting safe transaction...')
      const tx = await gnosisSafe.execTransaction(
        to,
        value,
        data,
        operation,
        safeTxGas,
        baseGas,
        gasPrice,
        gasToken,
        refundReceiver,
        signature,
        { gasPrice: ethers.utils.parseUnits('20', 'gwei') }
      )
      logger.info(`Tx hash: ${tx.hash}`)
      return { success: true, txHash: tx.hash }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err.message || err }
    }
  }
}

export default new TransactionRelayService()
