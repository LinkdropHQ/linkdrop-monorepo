/* global web3 */
import { put, select } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { factory, jsonRpcUrl } from 'app.config.js'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import LinkdropMastercopy from 'contracts/LinkdropMastercopy.json'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'initial' } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { ethAmount, account: fromWallet } = payload
    const newWallet = ethers.Wallet.createRandom()
    const { address: wallet, privateKey } = newWallet
    const provider = yield new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const gasPrice = yield provider.getGasPrice()
    const oneGwei = ethers.utils.parseUnits('1', 'gwei')
    const ethValueWei = utils.parseEther(String(ethAmount))
    const campaignId = yield select(generator.selectors.campaignId)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const isDeployed = yield factoryContract.isDeployed(fromWallet, campaignId)
    let data
    let to
    if (!isDeployed) {
      data = yield factoryContract.interface.functions.deployProxyWithSigner.encode([campaignId, wallet])
      to = factory
    } else {
      const proxyAddress = yield select(generator.selectors.proxyAddress)
      const proxyContract = yield new ethers.Contract(proxyAddress, LinkdropMastercopy.abi, provider)
      data = yield proxyContract.interface.functions.addSigner.encode([wallet])
      to = proxyAddress
    }
    const promise = new Promise((resolve, reject) => {
      web3.eth.sendTransaction({ to, from: fromWallet, gasPrice: gasPrice.add(oneGwei), value: ethValueWei, data }, (err, txHash) => {
        if (err) { console.error(err); reject(err) }
        return resolve({ txHash })
      })
    })
    const { txHash } = yield promise
    if (txHash) {
      yield put({ type: 'USER.SET_TX_HASH', payload: { txHash } })
      yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
      yield put({ type: 'USER.SET_PRIVATE_KEY', payload: { privateKey } })
      yield put({ type: 'METAMASK.SET_STATUS', payload: { status: 'finished' } })
    }
  } catch (e) {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    console.error(e)
  }
}

export default generator
generator.selectors = {
  proxyAddress: ({ campaigns: { proxyAddress } }) => proxyAddress,
  campaignId: ({ campaigns: { id } }) => id
}
