import assert from 'assert-js'
import { ethers } from 'ethers'
import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import { encodeParams } from './utils'
import BigNumber from 'bignumber.js'
import Web3 from 'web3'
import { signTx } from './signTx'
import { AddressZero } from 'ethers/constants'

const baseGasValue = hexValue => {
  switch (hexValue) {
    case '0x':
      return 0
    case '00':
      return 4
    default:
      return 68
  }
}

const estimateBaseGasCosts = dataString => {
  const reducer = (accumulator, currentValue) =>
    (accumulator += baseGasValue(currentValue))
  return dataString.match(/.{2}/g).reduce(reducer, 0)
}

const estimateBaseGas = ({
  safe,
  to,
  value,
  data,
  operation,
  txGasEstimate,
  gasPrice,
  gasToken,
  refundReceiver,
  signatureCount,
  nonce
}) => {
  // numbers < 256 are 192 -> 31 * 4 + 68
  // numbers < 65k are 256 -> 30 * 4 + 2 * 68
  // For signature array length and baseGasEstimate we already calculated the 0 bytes so we just add 64 for each non-zero byte
  const signatureCost = signatureCount * (68 + 2176 + 2176 + 6000) // (array count (3 -> r, s, v) + ecrecover costs) * signature count
  const payload = encodeParams(GnosisSafe.abi, 'execTransaction', [
    to,
    value,
    data,
    operation,
    txGasEstimate,
    0, // base gas
    gasPrice,
    gasToken,
    refundReceiver,
    '0x' // signature
  ])

  const baseGasEstimate =
    estimateBaseGasCosts(payload) +
    signatureCost +
    (nonce > 0 ? 5000 : 20000) +
    1500 // 1500 -> hash generation costs
  return baseGasEstimate + 32000 // Add aditional gas costs (e.g. base tx costs, transfer costs)
}

export const estimateGasCosts = async ({
  jsonRpcUrl,
  safe,
  to,
  value,
  data,
  operation,
  gasToken,
  refundReceiver,
  signatureCount = 1
}) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  let currentGasPriceGwei = await provider.getGasPrice()
  currentGasPriceGwei = ethers.utils.formatUnits(
    currentGasPriceGwei.toString(),
    'gwei'
  )
  currentGasPriceGwei = parseInt(Math.ceil(currentGasPriceGwei))

  const web3 = new Web3(jsonRpcUrl)
  const gnosisSafe = new web3.eth.Contract(GnosisSafe.abi, safe)
  const nonce = await gnosisSafe.methods.nonce().call()

  const estimateData = encodeParams(GnosisSafe.abi, 'requiredTxGas', [
    to,
    value,
    data,
    operation
  ])

  const estimateResponse = await provider.call({
    from: safe,
    to: safe,
    value,
    data: estimateData,
    gasPrice: 0
  })

  let txGasEstimate = new BigNumber(estimateResponse.substring(138), 16)
  // Add 10k else we will fail in case of nested calls
  txGasEstimate = txGasEstimate.toNumber() + 10000

  const gasCosts = []

  for (
    let gasPriceGwei = currentGasPriceGwei;
    gasPriceGwei <= currentGasPriceGwei + 5;
    gasPriceGwei++
  ) {
    const gasPrice = ethers.utils
      .parseUnits(gasPriceGwei.toString(), 'gwei')
      .toNumber()

    const baseGasEstimate = estimateBaseGas({
      safe,
      to,
      value,
      data,
      operation,
      txGasEstimate,
      gasToken,
      gasPrice,
      refundReceiver,
      signatureCount,
      nonce
    })

    gasCosts.push({
      gasPrice,
      baseGas: baseGasEstimate,
      safeTxGas: txGasEstimate
    })
  }
  return gasCosts
}
