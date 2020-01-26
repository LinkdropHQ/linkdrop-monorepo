import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from '@linkdrop/contracts/build/TokenMock.json'
import NFTMock from '@linkdrop/contracts/build/NFTMock.json'
import { jsonRpcUrlXdai, infuraPk } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import {
  getErc20Decimals,
  getErc20Amount,
  getErc20Symbol,
  getErc20Icon,
  getErc721Symbol,
  getErc721Icon
} from './helpers'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    console.log({ ethWalletContract })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { token, nativeTokensAmount, tokensAmount, chainId, nft, tokenId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const assets = []
    if (nft !== ethWalletContract) {
      const contract = yield new ethers.Contract(nft, NFTMock.abi, provider)
      const symbol = yield getErc721Symbol({ payload: { nft, contract } })
      const icon = yield getErc721Icon({ payload: { contract, nft, tokenId } })
      assets.push({ symbol, icon, type: 'erc721' })
    }

    if (nativeTokensAmount && Number(nativeTokensAmount) > 0) {
      const decimals = yield getErc20Decimals({ payload: { token: ethWalletContract } })
      const symbol = yield getErc20Symbol({ payload: { token: ethWalletContract } })
      const icon = yield getErc20Icon({ payload: { token: ethWalletContract } })
      const amount = yield getErc20Amount({ payload: { token: ethWalletContract, amount: nativeTokensAmount, decimals } })
      assets.push({ decimals, symbol, icon, amount, type: 'eth' })
    }

    if (tokensAmount && Number(tokensAmount) > 0 && token !== ethWalletContract) {
      const contract = yield new ethers.Contract(token, TokenMock.abi, provider)
      const decimals = yield getErc20Decimals({ payload: { token, contract } })
      const symbol = yield getErc20Symbol({ payload: { token, contract } })
      const icon = yield getErc20Icon({ payload: { token } })
      const amount = yield getErc20Amount({ payload: { token, amount: tokensAmount, decimals } })
      assets.push({ decimals, symbol, icon, amount, type: 'erc20' })
    }

    console.log({ assets })

    yield put({ type: 'TOKENS.SET_ASSETS', payload: { assets } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    console.error(e)
  }
}

export default generator
