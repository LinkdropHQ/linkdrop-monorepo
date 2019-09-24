import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'
import { factory } from 'app.config.js'

const generator = function * ({ payload }) {
  try {
    const { campaignId, tokenAddress, tokenAmount, weiAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature } = payload
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const ens = yield select(generator.selectors.ens)
    const contractAddress = yield select(generator.selectors.contractAddress)
    const privateKey = yield select(generator.selectors.privateKey)
    const walletContractExist = yield sdk.walletContractExist(ens)
    let result = {}
    const claimParams = {
      weiAmount: weiAmount || '0',
      tokenAddress,
      tokenAmount: tokenAmount || '0',
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: contractAddress,
      campaignId,
      factoryAddress: factory
    }

    if (walletContractExist) {
      console.log('...claiming')
      result = yield sdk.claim(claimParams)
    } else {
      const deployParams = {
        privateKey,
        ensName: ens
      }
      console.log('...claiming and deploy')
      result = yield sdk.claimAndDeploy(claimParams, deployParams)
    }
    const { success, errors, txHash } = result
    if (success) {
      yield put({ type: 'TOKENS.SET_TRANSACTION_ID', payload: { transactionId: txHash } })
    } else {
      if (errors.length > 0) {
        const currentError = ERRORS.indexOf(errors[0])
        yield put({ type: 'USER.SET_ERRORS', payload: { errors: [currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED'] } })
      }
    }
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (error) {
    console.error(error)
    const { response: { data: { errors = [] } = {} } = {} } = error
    if (errors.length > 0) {
      const currentError = ERRORS.indexOf(errors[0])
      yield put({ type: 'USER.SET_ERRORS', payload: { errors: [currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED'] } })
    }
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  ens: ({ user: { ens } }) => ens,
  privateKey: ({ user: { privateKey } }) => privateKey,
  contractAddress: ({ user: { contractAddress } }) => contractAddress
}
