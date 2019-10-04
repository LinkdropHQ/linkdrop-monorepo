import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { jsonRpcUrl } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: [] } })
    const { tokenAddress, account, currentAddress } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const provider = yield new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
    /* account - proxy, currentAddress - metamask address */
    const erc721IsApproved = yield tokenContract.isApprovedForAll(currentAddress, account)
    if (erc721IsApproved) {
      yield put({ type: 'TOKENS.SET_ERC721_IS_APPROVED', payload: { erc721IsApproved } })
    }

    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  proxyAddress: ({ campaigns: { proxyAddress } }) => proxyAddress,
  address: ({ tokens: { address } }) => address,
  decimals: ({ tokens: { decimals } }) => decimals
}
