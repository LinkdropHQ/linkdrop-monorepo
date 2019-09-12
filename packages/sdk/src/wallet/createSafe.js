import axios from 'axios'
import assert from 'assert-js'

/**
 * Function to create new safe
 * @param {String} owner Safe owner's address
 * @param {String} apiHost API host
 * @returns {Object} {success, txHash, safe, errors}
 */
export const create = async ({ owner, apiHost }) => {
  assert.string(owner, 'Please provide owner address')

  const response = await axios.post(`${apiHost}/api/v1/safes/create`, { owner })
  const { success, txHash, safe, errors } = response.data

  return {
    success,
    txHash,
    safe,
    errors
  }
}

/**
 * Function to create new safe
 * @param {String} owner Safe owner's address
 * @param {String} name ENS name to register for safe
 * @param {String} apiHost API host
 * @returns {Object} {success, txHash, safe, errors}
 */
export const createWithENS = async ({ owner, name, apiHost }) => {
  assert.string(owner, 'Owner is required')
  assert.string(name, 'Name is required')

  const response = await axios.post(`${apiHost}/api/v1/safes/createWithENS`, {
    owner,
    name
  })
  const { success, txHash, safe, errors } = response.data

  return {
    success,
    txHash,
    safe,
    errors
  }
}
