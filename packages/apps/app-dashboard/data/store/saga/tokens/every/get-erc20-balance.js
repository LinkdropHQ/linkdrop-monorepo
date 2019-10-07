import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })
    const { tokenAddress, account, currentAddress, chainId } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    // checking balance of ERC-20 from blockchain by tokenAddress
    const tokenContract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
    const decimals = yield select(generator.selectors.decimals)
    const erc20Balance = yield tokenContract.allowance(currentAddress, account)
    const erc20BalanceFormatted = utils.formatUnits(erc20Balance, decimals)
    if (Number(erc20BalanceFormatted) > 0) {
      yield put({ type: 'TOKENS.SET_ERC20_BALANCE', payload: { erc20BalanceFormatted, erc20Balance } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  proxyAddress: ({ campaigns: { proxyAddress } }) => proxyAddress,
  address: ({ tokens: { address } }) => address,
  decimals: ({ tokens: { decimals } }) => decimals
}
