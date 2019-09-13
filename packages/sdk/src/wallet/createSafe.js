import axios from 'axios'
import assert from 'assert-js'
import { computeSafeAddress } from './computeSafeAddress'
import { signReceiverAddress } from '../utils'
import { ethers } from 'ethers'

/**
 * Function to create new safe
 * @param {String} owner Safe owner's address
 * @param {String} name ENS name to register for safe
 * @param {String} apiHost API host
 * @returns {Object} {success, txHash, safe, errors}
 */
export const create = async ({ owner, name, apiHost }) => {
  assert.string(owner, 'Owner is required')
  assert.string(name, 'Name is required')

  const saltNonce = new Date().getTime()

  const response = await axios.post(`${apiHost}/api/v1/safes`, {
    owner,
    name,
    saltNonce
  })
  const { success, txHash, safe, errors } = response.data

  return {
    success,
    txHash,
    safe,
    errors
  }
}

/**
 * Function to create new safe and claim linkdrop
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {String} tokenAmount Token amount
 * @param {String} expirationTime Link expiration timestamp
 * @param {String} linkKey Ephemeral key assigned to link
 * @param {String} linkdropMasterAddress Linkdrop master address
 * @param {String} linkdropSignerSignature Linkdrop signer signature
 * @param {String} campaignId Campaign id
 * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
 * @param {String} proxyFactory Deployed proxy factory address
 * @param {String} owner Safe owner address
 * @param {String} name ENS name to register for safe
 * @param {String} apiHost API host
 * @returns {Object} {success, txHash, safe, errors}
 */
export const claimAndCreate = async ({
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  linkKey,
  linkdropMasterAddress,
  linkdropSignerSignature,
  campaignId,
  gnosisSafeMasterCopy,
  proxyFactory,
  owner,
  name,
  apiHost
}) => {
  assert.string(weiAmount, 'Wei amount is required')
  assert.string(tokenAddress, 'Token address is required')
  assert.string(tokenAmount, 'Token amount is required')
  assert.string(expirationTime, 'Expiration time is required')
  assert.string(linkKey, 'Link key is required')
  assert.string(linkdropMasterAddress, 'Linkdrop master address is requred')
  assert.string(
    linkdropSignerSignature,
    'Linkdrop signer signature is required'
  )
  assert.string(campaignId, 'Campaign id is required')
  assert.string(
    gnosisSafeMasterCopy,
    'Gnosis safe mastercopy address is required'
  )
  assert.string(proxyFactory, 'Proxy factory address is required')
  assert.string(owner, 'Owner is required')
  assert.string(name, 'Name is required')
  assert.string(apiHost, 'Api host is required')

  const saltNonce = new Date().getTime()

  const safe = computeSafeAddress({
    owner,
    saltNonce,
    gnosisSafeMasterCopy,
    proxyFactory
  })

  const receiverSignature = await signReceiverAddress(linkKey, safe)
  const linkId = new ethers.Wallet(linkKey).address

  const response = await axios.post(`${apiHost}/api/v1/safes/claimAndCreate`, {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    receiverAddress: safe,
    receiverSignature,
    owner,
    name,
    saltNonce
  })

  const { success, txHash, errors } = response.data

  return {
    success,
    txHash,
    safe,
    errors
  }
}
