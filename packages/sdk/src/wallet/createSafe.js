import axios from 'axios'
import assert from 'assert-js'
import { computeSafeAddress } from './computeSafeAddress'
import { signReceiverAddress } from '../utils'
import { ethers } from 'ethers'
import {
  encodeParams,
  encodeDataForCreateAndAddModules,
  encodeDataForMultiSend
} from './utils'

import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'
import MultiSend from '@gnosis.pm/safe-contracts/build/contracts/MultiSend'
import CreateAndAddModules from '@gnosis.pm/safe-contracts/build/contracts/CreateAndAddModules'
import LinkdropModule from '@linkdrop/safe-module-contracts/build/LinkdropModule'

const CALL_OP = 0
const DELEGATECALL_OP = 1

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
 * @param {String} linkdropModuleMasterCopy Deployed linkdrop module master copy address
 * @param {String} createAndAddModules Deployed createAndAddModules library address
 * @param {String} multiSend Deployed multiSend library address
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
  linkdropModuleMasterCopy,
  createAndAddModules,
  multiSend,
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

  assert.string(
    linkdropModuleMasterCopy,
    'Linkdrop module mastercopy address is required'
  )
  assert.string(
    createAndAddModules,
    'CreateAndAddModules library address is required'
  )
  assert.string(multiSend, 'MultiSend library address is required')

  const saltNonce = new Date().getTime()

  const linkdropModuleSetupData = encodeParams(LinkdropModule.abi, 'setup', [
    [owner]
  ])

  const linkdropModuleCreationData = encodeParams(
    ProxyFactory.abi,
    'createProxyWithNonce',
    [linkdropModuleMasterCopy, linkdropModuleSetupData, saltNonce]
  )

  const modulesCreationData = encodeDataForCreateAndAddModules([
    linkdropModuleCreationData
  ])

  const createAndAddModulesData = encodeParams(
    CreateAndAddModules.abi,
    'createAndAddModules',
    [proxyFactory, modulesCreationData]
  )

  const createAndAddModulesMultiSendData = encodeDataForMultiSend(
    DELEGATECALL_OP,
    createAndAddModules,
    0,
    createAndAddModulesData
  )

  const nestedTxData = '0x' + createAndAddModulesMultiSendData

  const multiSendData = encodeParams(MultiSend.abi, 'multiSend', [nestedTxData])

  const safe = computeSafeAddress({
    owner,
    saltNonce,
    gnosisSafeMasterCopy,
    deployer: proxyFactory,
    to: multiSend,
    data: multiSendData
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
