/* global describe, it */
import { expect } from 'chai'
import checkIfClaimedGenerator from 'data/store/saga/tokens/every/check-if-claimed.js'
import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { createMockProvider } from 'ethereum-waffle'
import { defineNetworkName } from '@linkdrop/commons'

const linkKey = '0x3e42a6647091a256103b6ad3d310b3887b3fe5d7f5e3d71df2f03985ca5ea071'
const provider = createMockProvider()
describe('data/store/saga/tokens/every/check-if-claimed.js', () => {
  const networkId = '1'
  const senderAddress = '0xbF0e4036BF968dD007F9B4A1BFdA4e54C042F612'
  const payload = {
    networkId,
    linkKey,
    senderAddress
  }
  const networkName = defineNetworkName({ networkId })
  const gen = checkIfClaimedGenerator({ payload })

  it('enable loading', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    )
  })

  it('create provider', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      ethers.getDefaultProvider(networkName)
    )
  })

  it('get wellet object', () => {
    expect(
      gen.next(provider).value
    ).to.deep.equal(
      new ethers.Wallet(linkKey, provider)
    )
  })
})
