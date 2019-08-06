import EIP712Domain from 'eth-typed-data'
import sigUtil from 'eth-sig-util'
import * as ethUtil from 'ethereumjs-util'
import { Buffer } from 'buffer'
import BigNumber from 'bignumber.js'

const domain = new EIP712Domain({
  verifyingContract: '0x0000000000000000000000000000000000000000' // Address of smart contract associated with this domain
})

const SafeTx = domain.createType('SafeTx', [
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
])

export const signTx = async ({
  safe,
  privateKey, // owner
  to,
  value,
  data = '0x',
  operation = '0',
  safeTxGas,
  baseGas,
  gasPrice,
  gasToken = '0x0000000000000000000000000000000000000000',
  refundReceiver = '0x0000000000000000000000000000000000000000',
  nonce
}) => {
  if (!safe) {
    throw new Error('Safe address is required')
  }
  if (!privateKey) {
    throw new Error('Private key is required')
  }
  if (!to) {
    throw new Error('To is required')
  }
  if (!value) {
    throw new Error('Value is required')
  }
  if (!safeTxGas) {
    throw new Error('Safe tx gas is required')
  }
  if (!baseGas) {
    throw new Error('Base gas is required')
  }
  if (!gasPrice) {
    throw new Error('Gas price is required')
  }
  if (!nonce) {
    throw new Error('Nonce is required')
  }

  if (privateKey.includes('0x')) {
    privateKey = privateKey.replace('0x', '')
  }

  privateKey = Buffer.from(privateKey, 'hex')

  const typedData = new SafeTx({
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
  }).toSignatureRequest()

  // const signature = ethUtil.ecsign(
  //   sigUtil.TypedDataUtils.sign(typedData),
  //   privateKey
  // )

  const signature = sigUtil.signTypedData(privateKey, {
    data: typedData
  })

  return {
    r: new BigNumber(signature.slice(2, 66), 16).toString(10),
    s: new BigNumber(signature.slice(66, 130), 16).toString(10),
    v: new BigNumber(signature.slice(130, 132), 16).toString(10)
  }
}

// signTx(
//   'EEDFA6C63D0B44CE6C511C7A9425A8668DFADFC8F47FF24647A92489D5A913CC',
//   '0x0000000000000000000000000000000000000000',
//   {
//     to: '0x0000000000000000000000000000000000000000',
//     value: '10000000000000000',
//     data: '0x',
//     operation: '0',
//     safeTxGas: '42671',
//     baseGas: '40660',
//     gasPrice: '10000000000',
//     gasToken: '0x0000000000000000000000000000000000000000',
//     refundReceiver: '0x0000000000000000000000000000000000000000',
//     nonce: 0
//   }
// )
