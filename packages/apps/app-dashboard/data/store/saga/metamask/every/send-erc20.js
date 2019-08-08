/* global web3 */
import { put, select } from 'redux-saga/effects'
import { mocks, defineNetworkName } from '@linkdrop/commons'
import { utils, ethers } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'

const generator = function * ({ payload }) {
  try {
    let web3Obj
    try {
      web3Obj = window.web3
    } catch (e) {
      web3Obj = new mocks.Web3Mock()
    }
    
    yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'initial' } })
    const { tokenAmount, account: fromWallet } = payload
    const chainId = yield select(generator.selectors.chainId)
    const decimals = yield select(generator.selectors.decimals)
    const tokenAddress = yield select(generator.selectors.address)
    const networkName = defineNetworkName({ chainId })

    const provider = yield ethers.getDefaultProvider(networkName)
    const gasPrice = yield provider.getGasPrice()
    const oneGwei = ethers.utils.parseUnits('1', 'gwei')
    const tokenContract = yield new web3Obj.eth.Contract(TokenMock.abi, tokenAddress)
    const proxyAddress = yield select(generator.selectors.proxyAddress)
    const amountFormatted = utils.parseUnits(String(tokenAmount), decimals)
    console.log({ tokenContract })
    const approveData = yield tokenContract.methods.approve(proxyAddress, String(amountFormatted)).encodeABI()
    const promise = new Promise((resolve, reject) => {
      web3Obj.eth.sendTransaction({ to: tokenAddress, gasPrice: gasPrice.add(oneGwei), from: fromWallet, value: 0, data: approveData }, (err, result) => {
        console.log(err, result)
        if (err) {
          console.log({ err })
          reject(err)
        }
        resolve({ result })
      })
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
  chainId: ({ user: { chainId } }) => chainId
}
