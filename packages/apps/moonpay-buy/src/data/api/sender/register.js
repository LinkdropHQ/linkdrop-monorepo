import fetch from '../fetch'

export default ({ senderAddress, apiHost }) => {
  const body = JSON.stringify({
    senderAddress
  })
  return fetch(`${apiHost}/linkdrops/register`, { method: 'POST', body })
}
