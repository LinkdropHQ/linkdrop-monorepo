import axios from 'axios'
import assert from 'assert'

/**
 * Function to create new safe
 * @param {String} apiHost API host
 * @param {String} owner Safe owner's address
 * @returns {Object} {success, txHash, safe, errors}
 */
export const createSafe = async ({ apiHost, owner }) => {
  assert(owner, 'Please provide owner address')

  const response = await axios.post(`${apiHost}/api/safes`, { owner })
  const { success, txHash, safe, errors } = response.data

  console.log('SDK', {
    success,
    txHash,
    safe,
    errors
  })

  return {
    success,
    txHash,
    safe,
    errors
  }
}
