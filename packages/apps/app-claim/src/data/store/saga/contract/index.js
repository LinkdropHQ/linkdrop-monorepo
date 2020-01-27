import { takeEvery } from 'redux-saga/effects'
import getPastEvents from './every/get-past-events'
import subscribeToClaimEvent from './every/subscribe-to-claim-event'
import getTokenData from './every/get-token-data'

export default function * () {
  yield takeEvery('*CONTRACT.GET_PAST_EVENTS', getPastEvents)
  yield takeEvery('*CONTRACT.SUBSCRIBE_TO_CLAIM_EVENT', subscribeToClaimEvent)
  yield takeEvery('*CONTRACT.GET_TOKEN_DATA', getTokenData)
}
