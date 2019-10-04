import { put } from 'redux-saga/effects'
import { ethers } from 'ethers'
import LinkdropFactory from 'contracts/LinkdropFactory.json'
import { factory, jsonRpcUrl } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const { currentAddress } = payload
    const provider = yield new ethers.providers.JsonRpcProvider(jsonRpcUrl)
    const factoryContract = yield new ethers.Contract(factory, LinkdropFactory.abi, provider)
    const version = yield factoryContract.getProxyMasterCopyVersion(currentAddress)
    yield put({ type: 'USER.SET_VERSION_VAR', payload: { version } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
