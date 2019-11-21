import { put, select } from 'redux-saga/effects'
import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    // const chainId = yield select(generator.selectors.chainId)
    const networkName = 'ropsten'
    const proxyAddress = yield select(generator.selectors.proxyAddress)
    const provider = yield ethers.getDefaultProvider(networkName)
    const ethBalance = yield provider.getBalance(proxyAddress)
    const balanceAmount = Number(ethBalance)
    if (balanceAmount > 0) {
      yield put({ type: 'ASSETS.SET_ETH_BALANCE', payload: { ethBalance: balanceAmount } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  proxyAddress: ({ user: { proxyAddress } }) => proxyAddress
}
