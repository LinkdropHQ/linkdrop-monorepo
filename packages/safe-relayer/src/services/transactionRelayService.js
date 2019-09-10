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
      logger.debug(`Tx hash: ${tx.hash}`)
      return { success: true, txHash: tx.hash }
    } catch (err) {
      logger.error(err)
      return { success: false, errors: err }
    }
  }
}

export default new TransactionRelayService()

// const main = async () => {
//   const transactionRelayService = new TransactionRelayService()
//   const txHash = await transactionRelayService.execute({
//     safe: '0x563df37ff1e6a70d6d0af364a9ca95c31ea61c94',
//     to: '0x646F6381010bA304cA1f912d6E7BB9972b4b6f56',
//     value: 1234,
//     data: '0x',
//     operation: 0,
//     safeTxGas: 0,
//     baseGas: 0,
//     gasPrice: 0,
//     gasToken: '0x0000000000000000000000000000000000000000',
//     refundReceiver: '0x0000000000000000000000000000000000000000',
//     signature:
//       '0xd87b24dadad5110acc87f58954453672d2f3ccde6238b51ec495148348fb05a6259f87356383673a4f225032c2586a14403e54f3cd6b43487ede30441a281cd21b'
//   })
//   console.log('txHash: ', txHash)
// }
