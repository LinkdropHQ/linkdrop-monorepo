import axios from 'axios'
import { signTx } from './signTx'

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
  if (!data) {
    throw new Error('Data is required')
  }
  const response = await axios({
    url: `/v2/safes/${safe}/transactions/estimate`,
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
  return { safeTxGas, baseGas, gasPrice, nonce: lastUsedNonce }
}

export const executeTx = async ({
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
  safe,
  privateKey, // owner
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
}) => {
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

  return axios({
    url: `/v2/safes/${safe}/transactions/`,
    method: 'post',
    data: {
      safe,
      to,
      value,
      data,
      operation,
      gasToken,
      safeTxGas,
      baseGas,
      gasPrice,
      refundReceiver,
      nonce,
      signatures: signature
    },
    baseURL
  })
}
