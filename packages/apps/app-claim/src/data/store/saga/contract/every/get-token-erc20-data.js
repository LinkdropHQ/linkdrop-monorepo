import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { getImages } from 'helpers'
import TokenMock from '@linkdrop/contracts/build/TokenMock.json'
import { infuraPk } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { tokenAmount, weiAmount, tokenAddress, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    let decimals
    let symbol
    let icon
    if (ethWalletContract === tokenAddress) {
      decimals = 18
      symbol = Number(chainId) === 100 ? 'xDAI' : 'ETH'
      if (Number(chainId) === 97) symbol = 'BNB'
      icon = getImages({ src: 'ether' }).imageRetina
    } else if (tokenAddress.toLowerCase() === '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359') {
      // SAI token has problem with fetching decimals
      decimals = 18
      symbol = 'SAI'
      icon = getImages({ src: 'sai' }).imageRetina
    } else if (tokenAddress.toLowerCase() === '0x6b175474e89094c44da98b954eedeac495271d0f') {
      // DAI token has problem with fetching decimals
      decimals = 18
      symbol = 'DAI'
      icon = getImages({ src: 'dai' }).imageRetina
    } else if (tokenAddress.toLowerCase() === '0xeb269732ab75a6fd61ea60b06fe994cd32a83549') {
      decimals = 18
      symbol = 'USDx'
      icon = `https://trustwalletapp.com/images/tokens/${tokenAddress.toLowerCase()}.png`
    } else {
      const contract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
      decimals = yield contract.decimals()
      symbol = yield contract.symbol()
      icon = `https://trustwalletapp.com/images/tokens/${tokenAddress.toLowerCase()}.png`
    }

    const amountBigNumber = utils.formatUnits(ethWalletContract === tokenAddress ? weiAmount : tokenAmount, decimals)
    if (decimals) {
      yield put({ type: 'CONTRACT.SET_DECIMALS', payload: { decimals } })
    }
    if (symbol) {
      yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol } })
    }
    yield put({ type: 'CONTRACT.SET_ICON', payload: { icon } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: amountBigNumber } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    console.error(e)
  }
}

export default generator
