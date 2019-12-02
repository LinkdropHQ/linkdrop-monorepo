import fetch from '../fetch'

export default ({ senderAddress, apiHost, factoryAddress }) => {
  const body = JSON.stringify({
    senderAddress,
    factoryAddress
  })
  return fetch(`${apiHost}/api/v1/linkdrops/register`, { method: 'POST', body })
}
