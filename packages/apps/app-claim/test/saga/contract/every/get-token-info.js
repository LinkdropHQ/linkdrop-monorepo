// /* global describe, it */
// import { put } from 'redux-saga/effects'
// import { expect } from 'chai'
// import { ethers } from 'ethers'
// import getTokenDataGenerator from 'data/store/saga/contract/every/get-token-data.js'
// import { createMockProvider } from 'ethereum-waffle'
// import config from 'contract-config.json'

// const provider = createMockProvider()
// describe('data/store/saga/contract/every/get-token-data.js saga logic', () => {
//   const tokenAddress = '0xB8c77482e45F1F44dE1745F52C74426C631bDD52'
//   const networkId = '1'
//   const amount = '100000000000000000'
//   const payload = { amount, tokenAddress, networkId }
//   const gen = getTokenDataGenerator({ payload })

//   it('enable loading', () => {
//     expect(
//       gen.next().value
//     ).to.deep.equal(
//       put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
//     )
//   })

//   it('get provider', () => {
//     expect(
//       gen.next().value
//     ).to.deep.equal(
//       ethers.getDefaultProvider('homestead')
//     )
//   })

//   it('get contract instance', () => {
//     const nextGenStep = gen.next(provider).value
//     const expectedNextGenStep = new ethers.Contract(tokenAddress, config.erc20Abi, provider)
//     expect(
//       nextGenStep
//     ).to.equal(
//       expectedNextGenStep
//     )
//   })

//   // it('must put fetched tokens to store', () => {
//   //   expect(
//   //     gen.next(response).value
//   //   ).to.deep.equal(
//   //     put({ type: 'NFT_TOKENS.SET_TOKENS', payload: { tokens: response.assets } })
//   //   )
//   // })

//   // it('must disable the loading', () => {
//   //   expect(
//   //     gen.next().value
//   //   ).to.deep.equal(
//   //     put({ type: 'NFT_TOKENS.SET_LOADING', payload: { loading: false } })
//   //   )
//   // })
// })
