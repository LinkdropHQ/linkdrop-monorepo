import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import ProxyFactory from '@gnosis.pm/safe-contracts/build/contracts/ProxyFactory'

import { ethers } from 'ethers'
import { getEncodedData, buildCreate2Address } from './utils'

ethers.errors.setLogLevel('error')

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

export const computeSafeAddress = async ({
  owner,
  saltNonce,
  gnosisSafeMasterCopy,
  proxyFactory,
  jsonRpcUrl
}) => {
  const provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl)

  const gnosisSafeData = getEncodedData(GnosisSafe.abi, 'setup', [
    [owner], // owners
    1, // threshold
    ADDRESS_ZERO, // to
    BYTES_ZERO, // data,
    ADDRESS_ZERO, // payment token address
    0, // payment amount
    ADDRESS_ZERO // payment receiver address
  ])

  const constructorData = ethers.utils.defaultAbiCoder.encode(
    ['address'],
    [gnosisSafeMasterCopy]
  )

  const encodedNonce = ethers.utils.defaultAbiCoder.encode(
    ['uint256'],
    [saltNonce]
  )

  const salt = ethers.utils.keccak256(
    ethers.utils.keccak256(gnosisSafeData) + encodedNonce.slice(2)
  )

  const proxyFactoryContract = new ethers.Contract(
    proxyFactory,
    ProxyFactory.abi,
    provider
  )

  const proxyCreationCode = await proxyFactoryContract.proxyCreationCode()

  const initcode = proxyCreationCode + constructorData.slice(2)

  return buildCreate2Address(proxyFactory, salt, initcode)
}
