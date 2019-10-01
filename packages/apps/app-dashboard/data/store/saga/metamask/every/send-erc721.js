/* global web3 */
import { put, select } from 'redux-saga/effects'
import { mocks, defineNetworkName } from '@linkdrop/commons'
import { utils, ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'

let web3Obj
try {
  web3Obj = web3
} catch (e) {
  web3Obj = new mocks.Web3Mock()
}
const generator = function * ({ payload }) {
  try {
    yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'initial' } })
    const { account: fromWallet } = payload
    const chainId = yield select(generator.selectors.chainId)
    const tokenAddress = yield select(generator.selectors.address)
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const gasPrice = yield provider.getGasPrice()
    const oneGwei = ethers.utils.parseUnits('1', 'gwei')
    const tokenContract = yield web3Obj.eth.contract(NFTMock.abi).at(tokenAddress)
    const proxyAddress = yield select(generator.selectors.proxyAddress)
    const approveData = yield tokenContract.setApprovalForAll.getData(proxyAddress, true)
    const promise = new Promise((resolve, reject) => {
      web3Obj.eth.sendTransaction({ to: tokenAddress, gasPrice: gasPrice.add(oneGwei), from: fromWallet, value: 0, data: approveData }, result => resolve({ result }))
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
  chainId: ({ user: { chainId } }) => chainId
}
