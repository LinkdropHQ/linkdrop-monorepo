import axios from 'axios'
import assert from 'assert-js'

/**
 * Function to create new safe
 * @param {String} apiHost API host
 * @param {String} owner Safe owner's address
 * @returns {Object} {success, txHash, safe, errors}
 */
export const createSafe = async ({ apiHost, owner }) => {
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
