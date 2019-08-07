import axios from 'axios'
import { signTx } from './signTx'
import BigNumber from 'bignumber.js'

export const triggerSafeDeployment = async (
  { owners, threshold, saltNonce },
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
) => {
  if (!owners) {
    throw new Error('Owners is required')
  }
  if (!threshold) {
    throw new Error('Threshold is required')
  }
  if (!saltNonce) {
    throw new Error('Salt nonce is required')
  }
  return axios({
    url: '/v2/safes/',
    method: 'post',
    data: {
      owners,
      threshold,
      saltNonce
    },
    baseURL
  })
}

export const notifyService = async (
  safe,
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
) => {
  if (!safe) {
    throw new Error('Safe address is required')
  }
  return axios({
    url: `/v2/safes/${safe}/funded`,
    method: 'put',
    baseURL
  })
}

export const getDeploymentTxHash = async (
  safe,
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
) => {
  if (!safe) {
    throw new Error('Safe address is required')
  }
  const response = await axios({
    url: `/v2/safes/${safe}/funded`,
    method: 'get',
    baseURL
  })
  return response.data.txHash
}

export const estimateTx = async ({
  safe,
  to,
  value,
  data = '0x',
  operation = '0',
  gasToken = '0x0000000000000000000000000000000000000000',
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
}) => {
  if (!safe) {
    throw new Error('Safe address is required')
  }
  if (!to) {
    throw new Error('To is required')
  }
  if (!value) {
    throw new Error('Value is required')
  }

  const response = await axios({
    url: `/v2/safes/${safe}/transactions/estimate/`,
    method: 'post',
    data: {
      safe,
      to,
      value,
      data,
      operation,
      gasToken
    },
    baseURL
  })

  const { safeTxGas, baseGas, gasPrice, lastUsedNonce } = response.data

  return {
    safeTxGas,
    baseGas,
    gasPrice,
    nonce: lastUsedNonce || '0'
  }
}

export const executeTx = async ({
  safe,
  privateKey, // owner
  to,
  value,
  data = '0x',
  operation = '0',
  gasToken = '0x0000000000000000000000000000000000000000',
  safeTxGas,
  baseGas,
  gasPrice,
  refundReceiver = '0x0000000000000000000000000000000000000000',
  nonce,
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
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

  const signature = await signTx({
    to,
    value,
    data,
    operation,
    safeTxGas,
    baseGas,
    gasPrice,
    gasToken,
    refundReceiver,
    nonce,
    safe,
    privateKey
  })

  console.log('Execute', {
    safe,
    to,
    value,
    data,
    operation,
    gasToken,
    safeTxGas,
    dataGas: baseGas,
    gasPrice,
    refundReceiver,
    nonce: nonce,
    signatures: [signature]
  })

  return axios({
    url: `/v1/safes/${safe}/transactions/`,
    method: 'post',
    data: {
      safe,
      to,
      value,
      data,
      operation,
      gasToken,
      safeTxGas,
      dataGas: baseGas,
      gasPrice,
      refundReceiver,
      nonce,
      signatures: [signature]
    },
    baseURL
  })
}
