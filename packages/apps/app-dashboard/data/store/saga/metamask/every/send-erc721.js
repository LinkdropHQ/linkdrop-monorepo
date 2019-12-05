import { put, select } from 'redux-saga/effects'
import { mocks, defineJsonRpcUrl } from '@linkdrop/commons'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'initial' } })
    const { account: fromWallet, chainId } = payload
    const web3Provider = yield select(generator.selectors.web3Provider)
    const tokenAddress = yield select(generator.selectors.address)
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const gasPrice = yield provider.getGasPrice()
    const oneGwei = ethers.utils.parseUnits('1', 'gwei')
    const tokenContract = yield new web3Provider.eth.Contract(NFTMock.abi, tokenAddress)
    const proxyAddress = yield select(generator.selectors.proxyAddress)
    const approveData = yield tokenContract.methods.setApprovalForAll(proxyAddress, true).encodeABI()
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
  tokenIds: ({ campaigns: { tokenIds } }) => tokenIds,
  address: ({ tokens: { address } }) => address,
  decimals: ({ tokens: { decimals } }) => decimals,
  chainId: ({ user: { chainId } }) => chainId,
  web3Provider: ({ user: { web3Provider }}) => web3Provider
}
