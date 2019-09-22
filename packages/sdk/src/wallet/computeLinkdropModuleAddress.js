import LinkdropModule from '@linkdrop/safe-module-contracts/build/LinkdropModule'
import assert from 'assert-js'

import { ethers } from 'ethers'
import { encodeParams, buildCreate2Address } from './utils'

ethers.errors.setLogLevel('error')

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

/**
 * Function to precompute linkdrop module address
 * @param {String} owner Safe owner's address
 * @param {Number} saltNonce Random salt nonce
 * @param {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
 * @param {String} deployer Deployer address
 */
export const computeLinkdropModuleAddress = ({
  owner,
  saltNonce,
  linkdropModuleMasterCopy,
  deployer
}) => {
  assert.string(owner, 'Owner address is required')
  assert.integer(saltNonce, 'Salt nonce is required')
  assert.string(
    linkdropModuleMasterCopy,
    'Linkdrop module mastercopy address is required'
  )
  assert.string(deployer, 'Deployer address is required')

  const linkdropModuleData = encodeParams(LinkdropModule.abi, 'setup', [
    [owner]
  ])

  const constructorData = ethers.utils.defaultAbiCoder.encode(
    ['address'],
    [linkdropModuleMasterCopy]
  )

  const encodedNonce = ethers.utils.defaultAbiCoder.encode(
    ['uint256'],
    [saltNonce]
  )

  const salt = ethers.utils.keccak256(
    ethers.utils.keccak256(linkdropModuleData) + encodedNonce.slice(2)
  )

  const initcode = proxyCreationCode + constructorData.slice(2)

  return buildCreate2Address(deployer, salt, initcode)
}

export const proxyCreationCode =
  '0x608060405234801561001057600080fd5b506040516020806101a88339810180604052602081101561003057600080fd5b8101908080519060200190929190505050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614156100c7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260248152602001806101846024913960400191505060405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050606e806101166000396000f3fe608060405273ffffffffffffffffffffffffffffffffffffffff600054163660008037600080366000845af43d6000803e6000811415603d573d6000fd5b3d6000f3fea165627a7a723058201e7d648b83cfac072cbccefc2ffc62a6999d4a050ee87a721942de1da9670db80029496e76616c6964206d617374657220636f707920616464726573732070726f7669646564'
