/* global describe, it */
import { expect } from 'chai'
import checkTransactionStatusGenerator from 'data/store/saga/tokens/every/check-transaction-status.js'
import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import { createMockProvider } from 'ethereum-waffle'
import { defineNetworkName } from '@linkdrop/commons'

const provider = createMockProvider()
describe('data/store/saga/tokens/every/check-transaction-status.js', () => {
  const networkId = '1'
  const transactionId = '0xbF0e4036BF968dD007F9B4A1BFdA4e54C042F612'
  const payload = {
    networkId,
    transactionId
  }
  const networkName = defineNetworkName({ networkId })
  const gen = checkTransactionStatusGenerator({ payload })
  const receipt = {
    confirmations: 1
  }
  it('create provider', () => {
    expect(
      gen.next().value
    ).to.deep.equal(
      ethers.getDefaultProvider(networkName)
    )
  })

  it('get transaction status', () => {
    expect(
      gen.next(provider).value
    ).to.deep.equal(
      provider.getTransactionReceipt(transactionId)
    )
  })

  it('update status to claimed', () => {
    expect(
      gen.next(receipt).value
    ).to.deep.equal(
      put({ type: 'TOKENS.SET_TRANSACTION_STATUS', payload: { transactionStatus: 'claimed' } })
    )
  })
})
