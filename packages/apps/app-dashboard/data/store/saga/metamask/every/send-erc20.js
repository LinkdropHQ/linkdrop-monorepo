import { put, select } from 'redux-saga/effects'
import { mocks, defineJsonRpcUrl } from '@linkdrop/commons'
import { utils, ethers } from 'ethers'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import TokenMock from 'contracts/TokenMock.json'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'initial' } })
    const { tokenAmount, account: fromWallet, chainId } = payload
    const decimals = yield select(generator.selectors.decimals)
    const web3Provider = yield select(generator.selectors.web3Provider)
    const tokenAddress = yield select(generator.selectors.address)
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const gasPrice = yield provider.getGasPrice()
    const oneGwei = ethers.utils.parseUnits('1', 'gwei')
    const tokenContract = yield web3Obj.eth.contract(TokenMock.abi).at(tokenAddress)
    const proxyAddress = yield select(generator.selectors.proxyAddress)
    const amountFormatted = utils.parseUnits(String(tokenAmount), decimals)
    const approveData = yield tokenContract.approve.getData(proxyAddress, String(amountFormatted), { from: fromWallet })
    const promise = new Promise((resolve, reject) => {
      web3Provider.eth.sendTransaction({ to: tokenAddress, gasPrice: gasPrice.add(oneGwei), from: fromWallet, value: 0, data: approveData }, result => resolve({ result }))
    })
    const { result } = yield promise
    if (String(result) === 'null') {
      yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'finished' } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  proxyAddress: ({ campaigns: { proxyAddress } }) => proxyAddress,
  address: ({ tokens: { address } }) => address,
  decimals: ({ tokens: { decimals } }) => decimals,
  web3Provider: ({ user: { web3Provider }}) => web3Provider
}
