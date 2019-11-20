import { call } from 'redux-saga/effects'
import { wasDeployed } from 'data/api/proxy'

const generator = function * ({ senderAddress, campaignId }) {
  try {
    const deployed = yield call(wasDeployed, { senderAddress, campaignId, apiHost: 'http://ropsten-v2.linkdrop.io' })
    console.log({ deployed })
  } catch (e) {
    console.error(e)
  }
}

export default generator
