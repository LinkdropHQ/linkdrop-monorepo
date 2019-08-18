import { put } from 'redux-saga/effects'
import { initializeWalletSdk } from 'data/sdk'
// import { jsonRpcUrl, apiHostRinkeby, apiHostMainnet, factory, initialBlockRinkeby, initialBlockMainnet } from 'app.config.js'
// import { ethers } from 'ethers'
// import Web3 from 'web3'
// import LinkdropMastercopy from 'contracts/LinkdropMastercopy.json'
import { defineNetworkName } from '@linkdrop/commons'

// const web3 = new Web3(Web3.givenProvider)

const generator = function * ({ payload }) {
  try {
    const { chainId } = payload
    const networkName = defineNetworkName({ chainId })
    // const apiHost = Number(chainId) === 1 ? apiHostMainnet : apiHostRinkeby
    const sdk = initializeWalletSdk({ chain: networkName })
    yield put({ type: 'USER.SET_SDK', payload: { sdk } })

    // const address = sdk.computeProxyAddress(factory, linkdropMasterAddress, campaignId)
    // const provider = yield ethers.getDefaultProvider(networkName)
    // const linkWallet = yield new ethers.Wallet(linkKey, provider)
    // const linkId = yield linkWallet.address
    // const contractWeb3 = yield new web3.eth.Contract(LinkdropMastercopy.abi, address)
    // const contractEthers = new ethers.Contract(address, LinkdropMastercopy.abi, provider)
    // const initialBlock = Number(chainId) === 4 ? initialBlockRinkeby : initialBlockMainnet

    // yield put({ type: '*ASSETS.GET_PAST_EVENTS', payload: { networkName, linkId, contract: contractWeb3, initialBlock } })
    // yield put({ type: '*ASSETS.SUBSCRIBE_TO_CLAIM_EVENT', payload: { networkName, linkId, contract: contractEthers, initialBlock } })
  } catch (e) {
    console.error(e)
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
  }
}

export default generator
