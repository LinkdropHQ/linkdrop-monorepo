import fetch from '../fetch'

export default ({ senderAddress, campaignId, apiHost }) => {
  const body = JSON.stringify({
    senderAddress, campaignId
  })
  return fetch(`${apiHost}/linkdrops/deploy`, { method: 'POST', body })
}
