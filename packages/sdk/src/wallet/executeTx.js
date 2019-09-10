import axios from 'axios'
import assert from 'assert-js'
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
  assert.url(apiHost, 'Api host is required')
  assert.url(jsonRpcUrl, 'Json rpc url is required')
  assert.string(safe, 'Safe address is required')
  assert.string(privateKey, 'Private key is required')
  assert.string(to, 'To is required')
  assert.integer(value, 'Value is required')
  assert.string(data, 'Data is required')
  assert.integer(safeTxGas, 'Safe tx gas is required')
  assert.integer(baseGas, 'Base gas is required')
  assert.integer(gasPrice, 'Gas price is required')
  assert.string(gasToken, 'Gas token is required')
  assert.string(refundReceiver, 'Refund receiver address is required')

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
    nonce: nonce.toNumber()
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
