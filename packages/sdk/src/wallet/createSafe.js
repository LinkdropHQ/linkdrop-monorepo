import axios from 'axios'
import assert from 'assert-js'

/**
 * Function to create new safe
 * @param {String} owner Safe owner's address
 * @param {String} apiHost API host
 * @returns {Object} {success, txHash, safe, errors}
 */
export const createSafe = async ({ owner, apiHost }) => {
  assert.string(owner, 'Please provide owner address')

  const response = await axios.post(`${apiHost}/api/v1/safes`, { owner })
  const { success, txHash, safe, errors } = response.data

  return {
    success,
    txHash,
    safe,
    errors
  }
}
