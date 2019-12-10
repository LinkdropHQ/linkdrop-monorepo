import fetch from '../fetch'

export default ({ senderAddress, campaignId, apiHost }) => fetch(`${apiHost}/linkdrops/${senderAddress}/${campaignId}`)
