import { put } from 'redux-saga/effects'
import initializeSdk from 'data/sdk'
import {
  factory,
  jsonRpcUrlXdai,
  infuraPk
} from 'app.config.js'
import { ethers } from 'ethers'
import Web3 from 'web3'
import { getInitialBlock } from 'helpers'
import LinkdropMastercopy from 'contracts/LinkdropMastercopy.json'
import { defineNetworkName, defineJsonRpcUrl } from '@linkdrop/commons'

const web3 = new Web3(Web3.givenProvider)

const generator = function * ({ payload }) {
  try {
    const { linkdropMasterAddress, chainId, linkKey, campaignId } = payload
    const networkName = defineNetworkName({ chainId })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const sdk = initializeSdk({
      factoryAddress: factory,
      chain: networkName,
      linkdropMasterAddress,
      jsonRpcUrl: actualJsonRpcUrl,
      apiHost: `https://${networkName}.linkdrop.io`
    })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })
    const address = sdk.getProxyAddress(campaignId)
    const linkWallet = yield new ethers.Wallet(linkKey, provider)
    const linkId = yield linkWallet.address
    const contractWeb3 = yield new web3.eth.Contract(LinkdropMastercopy.abi, address)
    const contractEthers = new ethers.Contract(address, LinkdropMastercopy.abi, provider)
    const initialBlock = getInitialBlock({ chainId })
    yield put({ type: '*CONTRACT.GET_PAST_EVENTS', payload: { networkName, linkId, contract: contractWeb3, initialBlock } })
    yield put({ type: '*CONTRACT.SUBSCRIBE_TO_CLAIM_EVENT', payload: { networkName, linkId, contract: contractEthers, initialBlock } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
