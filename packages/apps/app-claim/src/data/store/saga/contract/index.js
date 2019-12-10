import { takeEvery } from 'redux-saga/effects'

import getTokenERC20Data from './every/get-token-erc20-data'
import getTokenERC721Data from './every/get-token-erc721-data'
import getPastEvents from './every/get-past-events'
import subscribeToClaimEvent from './every/subscribe-to-claim-event'

export default function * () {
  yield takeEvery('*CONTRACT.GET_TOKEN_ERC20_DATA', getTokenERC20Data)
  yield takeEvery('*CONTRACT.GET_TOKEN_ERC721_DATA', getTokenERC721Data)
  yield takeEvery('*CONTRACT.GET_PAST_EVENTS', getPastEvents)
  yield takeEvery('*CONTRACT.SUBSCRIBE_TO_CLAIM_EVENT', subscribeToClaimEvent)
}
