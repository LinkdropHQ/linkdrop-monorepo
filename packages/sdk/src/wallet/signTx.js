import sigUtil from 'eth-sig-util'
import { Buffer } from 'buffer'
import assert from 'assert-js'

/**
 * Function to sign safe transaction
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
 * @param {Number} nonce Safe's nonce
 */
export const signTx = ({
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
}) => {
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
  assert.integer(nonce, 'Nonce is required')

  if (privateKey.includes('0x')) {
    privateKey = privateKey.replace('0x', '')
  }

  privateKey = Buffer.from(privateKey, 'hex')

  const typedData = getTypedData({
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
    nonce
  })

  /**
    r: new BigNumber(signature.slice(2, 66), 16).toString(10),
    s: new BigNumber(signature.slice(66, 130), 16).toString(10),
    v: new BigNumber(signature.slice(130, 132), 16).toString(10)
   */

  return sigUtil.signTypedData(privateKey, {
    data: typedData
  })
}

const getTypedData = ({
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
  nonce
}) => {
  return {
    types: {
      EIP712Domain: [{ type: 'address', name: 'verifyingContract' }],
      SafeTx: [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'value' },
        { type: 'bytes', name: 'data' },
        { type: 'uint8', name: 'operation' },
        { type: 'uint256', name: 'safeTxGas' },
        { type: 'uint256', name: 'baseGas' },
        { type: 'uint256', name: 'gasPrice' },
        { type: 'address', name: 'gasToken' },
        { type: 'address', name: 'refundReceiver' },
        { type: 'uint256', name: 'nonce' }
      ]
    },
    domain: {
      verifyingContract: safe
    },
    primaryType: 'SafeTx',
    message: {
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
    }
  }
}
