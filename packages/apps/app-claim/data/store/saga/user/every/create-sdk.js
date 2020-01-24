import { put } from 'redux-saga/effects'
import initializeSdk from 'data/sdk'
import {
  jsonRpcUrlXdai,
  infuraPk,
  factory
} from 'app.config.js'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { getInitialBlock } from 'helpers'
import Linkdrop from '@linkdrop/contracts/build/Linkdrop.json'
import { defineNetworkName, defineJsonRpcUrl } from '@linkdrop/commons'
import getCoinbaseLink from 'data/store/saga/deeplinks/every/get-coinbase-link'

const web3 = new Web3(Web3.givenProvider)

const generator = function * ({ payload }) {
  try {
    const { senderAddress, chainId, linkKey, campaignId } = payload
    const networkName = defineNetworkName({ chainId })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    console.log({
      factoryAddress: factory,
      chain: networkName,
      senderAddress,
      jsonRpcUrl: actualJsonRpcUrl,
      apiHost: `https://${networkName}-v2.linkdrop.io`
    })
    const sdk = initializeSdk({
      factoryAddress: factory,
      chain: networkName,
      senderAddress,
      jsonRpcUrl: actualJsonRpcUrl,
      apiHost: `https://${networkName}-v2.linkdrop.io`
    })
    const coinbaseLink = yield getCoinbaseLink({ payload: { chainId } })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    const address = sdk.getProxyAddress(campaignId)
    const linkWallet = yield new ethers.Wallet(linkKey, provider)
    const linkId = yield linkWallet.address
    const contractWeb3 = yield new web3.eth.Contract(Linkdrop.abi, address)
    const contractEthers = new ethers.Contract(address, Linkdrop.abi, provider)
    const initialBlock = getInitialBlock({ chainId })
    yield put({ type: '*CONTRACT.GET_PAST_EVENTS', payload: { networkName, linkId, contract: contractWeb3, initialBlock } })
    yield put({ type: '*CONTRACT.SUBSCRIBE_TO_CLAIM_EVENT', payload: { networkName, linkId, contract: contractEthers, initialBlock } })
    if (coinbaseLink) {
      yield put({ type: 'DEEPLINKS.SET_COINBASE_LINK', payload: { coinbaseLink } })
    }
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
