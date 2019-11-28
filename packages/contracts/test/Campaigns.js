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
import LinkdropTransfer from '../build/LinkdropTransfer'
import Linkdrop from '../build/Linkdrop'

import { computeProxyAddress } from '../scripts/utils'

// Turn off annoying warnings
ethers.errors.setLogLevel('error')

chai.use(solidity)
const { expect } = chai

const provider = createMockProvider()

const [deployer, sender] = getWallets(provider)

let masterCopy
let masterCopyTransfer
let factory
let proxy
let campaignId

const chainId = 4 // Rinkeby

describe('Campaigns tests', () => {
  it('should deploy master copies of linkdrop contracts', async () => {
    masterCopy = await deployContract(sender, Linkdrop, [], {
      gasLimit: 6000000
    })
    expect(masterCopy.address).to.not.eq(ethers.constants.AddressZero)

    masterCopyTransfer = await deployContract(sender, LinkdropTransfer, [], {
      gasLimit: 6000000
    })
    expect(masterCopyTransfer.address).to.not.eq(ethers.constants.AddressZero)
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
    const version = await factory.masterCopyVersion()
    expect(version).to.eq(1)
  })

  it('should deploy proxy for the first campaign with signing key', async () => {
    factory = factory.connect(sender)
    campaignId = 0

    // Compute next address with js function
    const expectedAddress = computeProxyAddress(
      factory.address,
      sender.address,
      campaignId
    )

    await expect(
      factory.deployProxyWithSigner(campaignId, sender.address, {
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, sender)

    const linkdropMasterAddress = await proxy.sender()
    expect(linkdropMasterAddress).to.eq(sender.address)

    const version = await proxy.version()
    expect(version).to.eq(1)

    const owner = await proxy.owner()
    expect(owner).to.eq(factory.address)

    const isSigner = await proxy.isSigner(sender.address)
    expect(isSigner).to.eq(true)
  })

  it('should deploy proxy for the second campaign', async () => {
    factory = factory.connect(sender)
    campaignId = 1

    // Compute next address with js function
    const expectedAddress = computeProxyAddress(
      factory.address,
      sender.address,
      campaignId
    )

    await expect(
      factory.deployProxy(campaignId, {
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, sender)

    const senderAddress = await proxy.sender()
    expect(senderAddress).to.eq(sender.address)

    const version = await proxy.version()
    expect(version).to.eq(1)

    const owner = await proxy.owner()
    expect(owner).to.eq(factory.address)
  })

  it('should deploy proxy for the third campaign', async () => {
    factory = factory.connect(sender)
    campaignId = 2

    // Compute next address with js function
    const expectedAddress = computeProxyAddress(
      factory.address,
      sender.address,
      campaignId
    )

    await expect(
      factory.deployProxy(campaignId, {
        gasLimit: 6000000
      })
    ).to.emit(factory, 'Deployed')

    proxy = new ethers.Contract(expectedAddress, Linkdrop.abi, sender)

    const linkdropMasterAddress = await proxy.sender()
    expect(linkdropMasterAddress).to.eq(sender.address)

    const version = await proxy.version()
    expect(version).to.eq(1)

    const owner = await proxy.owner()
    expect(owner).to.eq(factory.address)
  })
})
