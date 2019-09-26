import axios from 'axios'
import assert from 'assert-js'
import { ethers } from 'ethers'
import { signTx } from './signTx'
import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import { estimateGasCosts } from './estimateTxGas'
import Web3 from 'web3'

const getGasSpectrum = async ({
  jsonRpcUrl,
  safe,
  privateKey,
  to,
  value,
  data,
  operation,
  gasToken,
  refundReceiver
}) => {
  const web3 = new Web3(jsonRpcUrl)
  const gnosisSafe = new web3.eth.Contract(GnosisSafe.abi, safe)
  const nonce = await gnosisSafe.methods.nonce().call()

  const gasSpectrum = await estimateGasCosts({
    jsonRpcUrl,
    safe,
    to,
    value,
    data,
    operation,
    gasToken,
    refundReceiver,
    signatureCount: 1
  })

  for (let i = 0; i < gasSpectrum.length; i++) {
    gasSpectrum[i].signature = await signTx({
      safe,
      privateKey,
      to,
      value,
      data,
      operation,
      safeTxGas: gasSpectrum[i].safeTxGas,
      baseGas: gasSpectrum[i].baseGas,
      gasPrice: gasSpectrum[i].gasPrice,
      gasToken,
      refundReceiver,
      nonce: parseInt(nonce)
    })

    // Estimate gas of paying transaction
    const estimate = await gnosisSafe.methods
      .execTransaction(
        to,
        value,
        data,
        operation,
        gasSpectrum[i].safeTxGas,
        gasSpectrum[i].baseGas,
        gasSpectrum[i].gasPrice,
        gasToken,
        refundReceiver,
        gasSpectrum[i].signature
      )
      .estimateGas({
        from: new ethers.Wallet(privateKey).address,
        gasPrice: gasSpectrum[i].gasPrice
      })

    // Add the txGasEstimate and an additional 10k to the estimate to ensure that there is enough gas for the safe transaction
    gasSpectrum[i].gasLimit = estimate + gasSpectrum[i].safeTxGas + 10000
  }
  console.log('gasSpectrum: ', gasSpectrum)
  return gasSpectrum
}

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
  assert.string(gasToken, 'Gas token is required')
  assert.string(refundReceiver, 'Refund receiver address is required')

  const gasSpectrum = await getGasSpectrum({
    jsonRpcUrl,
    safe,
    privateKey,
    to,
    value,
    data,
    operation,
    gasToken,
    refundReceiver
  })

  const response = await axios.post(`${apiHost}/api/v1/safes/execute`, {
    safe,
    to,
    value,
    data,
    operation,
    gasToken,
    refundReceiver,
    gasSpectrum
  })

  const { success, txHash, errors } = response.data

  return {
    success,
    txHash,
    errors
  }
}
