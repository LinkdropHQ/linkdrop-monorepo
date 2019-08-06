import axios from 'axios'

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const triggerSafeDeployment = async (
  { owners, threshold, saltNonce },
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
) => {
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
  safeAddress,
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
) => {
  return axios({
    url: `/v2/safes/${safeAddress}/funded`,
    method: 'put',
    baseURL
  })
}

export const getDeploymentTxHash = async (
  safeAddress,
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
) => {
  const response = await axios({
    url: `/v2/safes/${safeAddress}/funded`,
    method: 'get',
    baseURL
  })
  return response.data.txHash
}

export const getEstimation = async ({
  safeAddress,
  to,
  value,
  data,
  operation = '0',
  gasToken = '0x0000000000000000000000000000000000000000',
  baseURL = 'https://safe-relay.rinkeby.gnosis.pm/api'
}) => {
  const response = await axios({
    url: `/v2/safes/${safeAddress}/transactions/estimate`,
    method: 'post',
    data: {
      safe: safeAddress,
      to,
      value,
      data,
      operation,
      gasToken
    },
    baseURL
  })
}
