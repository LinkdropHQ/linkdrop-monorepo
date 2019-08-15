import { put } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'
import { getImages } from 'helpers'
import TokenMock from 'contracts/TokenMock.json'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { tokenAmount, weiAmount, tokenAddress, chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    let decimals
    let symbol
    let icon
    if (ethWalletContract === tokenAddress) {
      decimals = 18
      symbol = 'ETH'
      icon = getImages({ src: 'ether' }).imageRetina
    } else if (tokenAddress.toLowerCase() === '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359') {
      // DAI token has problem with fetching decimals
      decimals = 18
      symbol = 'DAI'
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
