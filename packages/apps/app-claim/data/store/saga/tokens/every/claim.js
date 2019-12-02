import { put, select } from 'redux-saga/effects'
import { ERRORS } from './data'

const generator = function * ({ payload }) {
  try {
    const {
      token,
      feeToken,
      feeReceiver,
      linkKey,
      nativeTokensAmount,
      tokensAmount,
      feeAmount,
      expiration,
      signerSignature,
      receiverAddress,
      linkdropContract,
      sender,
      nft,
      tokenId,
      campaignId
    } = payload

    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const proxyAddress = yield sdk.getProxyAddress()
    let claimMethod = sdk.claimAndDeploy

    const isDeployed = yield sdk.isDeployed(campaignId)
    if (isDeployed) {
      claimMethod = sdk.claim
    }
    const { success, errors, txHash } = yield claimMethod({
      nativeTokensAmount: nativeTokensAmount || '0',
      token,
      tokensAmount: tokensAmount || '0',
      expiration,
      linkKey,
      signerSignature,
      receiverAddress,
      linkdropContract,
      sender,
      feeToken,
      feeReceiver,
      feeAmount,
      nft,
      tokenId
    })

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
    const { response: { data: { errors = [] } = {} } = {} } = error
    if (errors.length > 0) {
      const currentError = ERRORS.indexOf(errors[0])
      yield put({ type: 'USER.SET_ERRORS', payload: { errors: [currentError > -1 ? errors[0] : 'SERVER_ERROR_OCCURED'] } })
    }
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk
}
