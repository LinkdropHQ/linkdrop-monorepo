/* global web3 */
import { mocks } from '@linkdrop/commons'
import { put, select } from 'redux-saga/effects'
import TokenMock from 'contracts/TokenMock.json'
import { utils } from 'ethers'

let web3Obj
try {
  web3Obj = web3
} catch (e) {
  web3Obj = new mocks.Web3Mock()
}

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { to, amount, tokenAddress, decimals } = payload
    const sdk = yield select(generator.selectors.sdk)
    const privateKey = yield select(generator.selectors.privateKey)
    const tokenContract = yield web3Obj.eth.contract(TokenMock.abi).at(tokenAddress)
    const contractAddress = yield select(generator.selectors.contractAddress)
    const amountFormatted = utils.parseUnits(String(amount.trim()), decimals)
    const data = yield tokenContract.transfer.getData(to, String(amountFormatted), { from: contractAddress })
    const message = {
      from: contractAddress,
      to: tokenAddress,
      data,
      value: '0'
    }
    const result = yield sdk.execute(message, privateKey)
    const { success, errors, txHash } = result
    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      if (errors.length > 0) {
        yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
        console.error(errors[0])
      }
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  contractAddress: ({ user: { contractAddress } }) => contractAddress,
  privateKey: ({ user: { privateKey } }) => privateKey,
  chainId: ({ user: { chainId = '1' } }) => chainId
}
