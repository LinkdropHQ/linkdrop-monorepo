/* global describe, it */

import chai from 'chai'
import { ethers } from 'ethers'

import {
  createMockProvider,
  deployContract,
  getWallets,
  solidity
} from 'ethereum-waffle'

import LinkdropFactory from '../build/LinkdropFactory'
import Linkdrop from '../build/Linkdrop'
import LinkdropTransfer from '../build/LinkdropTransfer'

import { computeBytecode, computeProxyAddress } from '../scripts/utils'

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

chai.use(solidity)
const { expect } = chai

const provider = createMockProvider()

const [sender, deployer] = getWallets(provider)

let masterCopy
let masterCopyTransfer
let factory
let proxy
let bytecode

const chainId = 4 // Rinkeby
const campaignId = 1

describe('Proxy upgradability tests', () => {
  //

  it('should deploy initial master copy of linkdrop implementation', async () => {
    masterCopy = await deployContract(deployer, Linkdrop, [], {
      gasLimit: 6000000
    })
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)

    const masterCopyOwner = await masterCopy.owner()
    expect(masterCopyOwner).to.eq(ethers.constants.AddressZero)

    const masterCopySender = await masterCopy.sender()
    expect(masterCopySender).to.eq(ethers.constants.AddressZero)

    const masterCopyVersion = await masterCopy.version()
    expect(masterCopyVersion).to.eq(0)

    const masterCopyChainId = await masterCopy.chainId()
    expect(masterCopyChainId).to.eq(0)

    masterCopyTransfer = await deployContract(deployer, LinkdropTransfer, [], {
      gasLimit: 6000000
    })
    expect(masterCopyTransfer.address).to.not.eq(ethers.constants.AddressZero)

    const masterCopyTransferOwner = await masterCopyTransfer.owner()
    expect(masterCopyTransferOwner).to.eq(ethers.constants.AddressZero)

    const masterCopyTransferSender = await masterCopyTransfer.sender()
    expect(masterCopyTransferSender).to.eq(ethers.constants.AddressZero)

    const masterCopyTransferVersion = await masterCopyTransfer.version()
    expect(masterCopyTransferVersion).to.eq(0)

    const masterCopyTransferChainId = await masterCopyTransfer.chainId()
    expect(masterCopyTransferChainId).to.eq(0)
  })

  it('should deploy factory', async () => {
    factory = await deployContract(
      deployer,
      LinkdropFactory,
      [masterCopyTransfer.address, masterCopy.address, chainId],
      {
        gasLimit: 6000000
      }
    )
    expect(factory.address).to.not.eq(ethers.constants.AddressZero)
    const factoryVersion = await factory.masterCopyVersion()
    expect(factoryVersion).to.eq(1)

    const factoryChainId = await factory.chainId()
    expect(factoryChainId).to.eq(chainId)

    const masterCopyOwner = await masterCopy.owner()
    expect(masterCopyOwner).to.eq(ethers.constants.AddressZero)

    const masterCopySender = await masterCopy.sender()
    expect(masterCopySender).to.eq(ethers.constants.AddressZero)

    const masterCopyVersion = await masterCopy.version()
    expect(masterCopyVersion).to.eq(factoryVersion)

    const masterCopyChainId = await masterCopy.chainId()
    expect(masterCopyChainId).to.eq(factoryChainId)
  })

  it('should deploy proxy and delegate to implementation', async () => {
    // Compute next address with js function
    const expectedAddress = computeProxyAddress(
      factory.address,
      sender.address,
      campaignId
    )

    factory = factory.connect(sender)

    await expect(
      factory.deployProxy(campaignId, {
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, deployer)

    const senderAddress = await proxy.sender()
    expect(senderAddress).to.eq(sender.address)

    const version = await proxy.version()
    expect(version).to.eq(1)

    const owner = await proxy.owner()
    expect(owner).to.eq(factory.address)

    const type = await proxy.getType()
    expect(type).to.eq('ONE_TO_MANY')
  })

  it('should deploy second version of mastercopy', async () => {
    const oldMasterCopyAddress = masterCopy.address

    masterCopy = await deployContract(deployer, Linkdrop, [], {
      gasLimit: 6000000
    })

    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)
    expect(masterCopy.address).to.not.eq(oldMasterCopyAddress)
  })

  it('should set mastercopy and update bytecode in factory', async () => {
    bytecode = computeBytecode(masterCopy.address)
    factory = factory.connect(deployer)
    await factory.setMasterCopy(masterCopy.address)
    const deployedBytecode = await factory.getBytecode()
    expect(deployedBytecode.toString().toLowerCase()).to.eq(
      bytecode.toString().toLowerCase()
    )
  })

  it('proxy owner should be able to destroy proxy', async () => {
    factory = factory.connect(sender)

    let isDeployed = await factory['isDeployed(address,uint256)'](
      sender.address,
      campaignId
    )

    expect(isDeployed).to.eq(true)

    const computedAddress = computeProxyAddress(
      factory.address,
      sender.address,
      campaignId
    )

    const deployedAddress = await factory.getProxyAddress(
      sender.address,
      campaignId
    )
    expect(deployedAddress.toString().toLowerCase()).to.eq(
      computedAddress.toString().toLowerCase()
    )

    await expect(
      factory.destroyProxy(campaignId, {
        gasLimit: 6400000
      })
    ).to.emit(factory, 'Destroyed')

    isDeployed = await factory['isDeployed(address,uint256)'](
      sender.address,
      campaignId
    )
    expect(isDeployed).to.eq(false)
  })

  it('should deploy upgraded proxy to the same address as before', async () => {
    await expect(
      factory.deployProxy(campaignId, {
        gasLimit: 6400000
      })
    ).to.emit(factory, 'Deployed')

    const isDeployed = await factory['isDeployed(address,uint256)'](
      sender.address,
      campaignId
    )
    expect(isDeployed).to.eq(true)

    const computedAddress = computeProxyAddress(
      factory.address,
      sender.address,
      campaignId
    )

    const factoryVersion = await factory.masterCopyVersion()
    expect(factoryVersion).to.eq(2)

    proxy = new ethers.Contract(computedAddress, Linkdrop.abi, deployer)

    const proxyVersion = await proxy.version()
    expect(proxyVersion).to.eq(factoryVersion)
  })
})
