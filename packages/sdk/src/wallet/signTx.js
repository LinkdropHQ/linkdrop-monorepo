import { ethers } from 'ethers'

const signTx = async (
  signingKeyOrWallet,
  {
    to,
    value,
    data = '0x',
    operation = '0',
    safeTxGas,
    dataGas,
    gasPrice,
    gasToken = '0x0000000000000000000000000000000000000000',
    refundReceiver = '0x0000000000000000000000000000000000000000',
    nonce,
    safe
  }
) => {
  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = ethers.Wallet(signingKeyOrWallet)
  }

  const typedData = {
    types: {
      EIP712Domain: [{ type: 'address', name: 'verifyingContract' }],
      SafeTx: [
        { type: 'address', name: 'to' },
        { type: 'uint256', name: 'value' },
        { type: 'bytes', name: 'data' },
        { type: 'uint8', name: 'operation' },
        { type: 'uint256', name: 'safeTxGas' },
        { type: 'uint256', name: 'dataGas' },
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
      dataGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce
    }
  }
}
