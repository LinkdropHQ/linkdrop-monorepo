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

    console.log({
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
    })



    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const sdk = yield select(generator.selectors.sdk)
    const proxyAddress = yield sdk.getProxyAddress()
    const { success, errors, txHash } = yield sdk.claim({
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
    console.log({
      success, errors, txHash
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
