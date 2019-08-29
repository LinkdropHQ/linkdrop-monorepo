import { defineNetworkName } from '@linkdrop/commons'
import { put, select } from 'redux-saga/effects'
import TokenMock from 'contracts/TokenMock.json'
import { utils, ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { to, amount, tokenAddress, decimals, chainId = '1' } = payload
    const sdk = yield select(generator.selectors.sdk)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const privateKey = yield select(generator.selectors.privateKey)
    const tokenContract = new ethers.Contract(tokenAddress, TokenMock.abi, provider)
    const contractAddress = yield select(generator.selectors.contractAddress)
    const amountFormatted = utils.parseUnits(String(amount.trim()), decimals)
    const data = yield tokenContract.interface.functions.transfer.encode([to, amountFormatted])
    const message = {
      from: contractAddress,
      to: tokenAddress,
      data,
      value: '0'
    }
    const result = yield sdk.execute(message, privateKey)

    const { success, errors, txHash } = result
    alert(JSON.stringify({ success, errors, txHash }))
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
