import axios from 'axios'
import assert from 'assert'
import { ethers } from 'ethers'
import { signTx } from './signTx'
import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'

/**
 * Function to execute safe transaction
 * @param {String} apiHost API host
 * @param {String} jsonRpcUrl JSON RPC URL
 * @param {String} safe Safe address
 * @param {String} privateKey Safe owner's private key
 * @param {String} to To
 * @param {Number} value Value
 * @param {String} data Data
 * @param {Number} operation Operation
 * @param {Number} safeTxGas Safe tx gas
 * @param {Number} baseGas Base gas
 * @param {Number} gasPrice Gas price
 * @param {String} gasToken Gas token
 * @param {String} refundReceiver Refund receiver
 * @returns {Object} {success, txHash, errors}
 */
export const executeTx = async ({
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
  assert(apiHost, 'Api host is required')
  assert(jsonRpcUrl, 'Json rpc url is required')
  assert(safe, 'Safe address is required')
  assert(privateKey, 'Private key is required')
  assert(to, 'To is required')
  assert(value, 'Value is required')
  assert(data, 'Data is required')
  assert(safeTxGas, 'Safe tx gas is required')
  assert(baseGas, 'Base gas is required')
  assert(gasPrice, 'Gas price is required')
  assert(gasToken, 'Gas token is required')
  assert(refundReceiver, 'Refund receiver address is required')

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
