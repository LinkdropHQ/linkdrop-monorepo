import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'
import { getImages } from 'helpers'
import TokenMock from 'contracts/TokenMock.json'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: true } })
    const { weiAmount } = payload
    const decimals = 18
    const symbol = 'ETH'
    const icon = getImages({ src: 'ether' }).imageRetina
    const amountBigNumber = utils.formatUnits(weiAmount, decimals)
    const contracts = yield select(generator.selectors.contracts)
    if (decimals) {
      yield put({ type: 'CONTRACT.SET_DECIMALS', payload: { decimals } })
    }
    if (symbol) {
      yield put({ type: 'CONTRACT.SET_SYMBOL', payload: { symbol } })
    }
    yield put({ type: 'CONTRACT.SET_ETHEREUM_ICON', payload: { icon } })
    yield put({ type: 'CONTRACT.SET_AMOUNT', payload: { amount: amountBigNumber } })
    yield put({ type: 'CONTRACT.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  contracts: ({ user: { sdk } }) => sdk
}
