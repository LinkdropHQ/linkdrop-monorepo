import { call } from 'redux-saga/effects'
import { wasDeployed } from 'data/api/proxy'

const generator = function * ({ payload }) {
  try {
    const { senderAddress, campaignId } = payload
    const deployed = yield call(wasDeployed, { senderAddress, campaignId })
    console.log({ deployed })
  } catch (e) {
    console.error(e)
  }
}

export default generator
