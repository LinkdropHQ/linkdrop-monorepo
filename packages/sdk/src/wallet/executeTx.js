import axios from 'axios'
import assert from 'assert'
import { ethers } from 'ethers'
import { signTx } from './signTx'

/**
 * Function to execute safe transaction
 * @param {String} apiHost API host
 * @param {String} owner Safe owner's wallet
 */
export const execute = async ({
  apiHost,
  jsonRpcUrl,
  safe,
  privateKey,
  to,
  value,
  data,
  operation,
  safeTxGas,
  baseGas,
  gasPrice,
  gasToken,
  refundReceiver
}) => {
  // assert(owner, 'Please provide owner wallet')
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)
  const gnosisSafe = new ethers.Contract(safe, GnosisSafe.abi, provider)
  const nonce = await gnosisSafe.nonce()
  const signature = signTx({
    safe,
    privateKey,
    to,
    value,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce
  })

  const response = await axios.post(`${apiHost}/api/v1/safes/execute`, {
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
  })

  const { success, txHash, errors } = response.data

  console.log('SDK', {
    success,
    txHash,
    errors
  })

  return {
    success,
    txHash,
    errors
  }
}
