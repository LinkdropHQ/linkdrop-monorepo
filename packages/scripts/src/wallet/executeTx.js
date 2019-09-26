import { WalletSDK } from '../../../sdk/src/index'
import { ethers } from 'ethers'
import { AddressZero } from 'ethers/constants'
ethers.errors.setLogLevel('error')

const executeTx = async () => {
  try {
    const walletSDK = new WalletSDK({})

    const data =
      '0xc1dcab14000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000067265777265770000000000000000000000000000000000000000000000000000'

    const { errors, success, txHash } = await walletSDK.executeTx({
      jsonRpcUrl: 'https://rinkeby.infura.io',
      safe: '0x943d9edc7c458a23d72cec639a9fc61d0bbf7f59',
      to: '0x1b75f5da617c46b41d09ef36ac9b467a17d6095b',
      value: 0,
      data,
      operation: 0,
      gasToken: AddressZero,
      refundReceiver: AddressZero,
      signatureCount: 1,
      privateKey: ''
    })

    if (success === true && txHash) {
      console.log('Submitted executeTx transaction')
      console.log(`Tx hash: ${txHash}\n`)
    }
  } catch (err) {
    console.log('Failed to execute tx')
    throw new Error(err)
  }
}

executeTx()
