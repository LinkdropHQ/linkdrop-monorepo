import fetch from '../fetch'

export default ({ url, networkName }) => {
  const cbHost = `https://${networkName}.linkdrop.io/api/v1/utils/get-coinbase-deeplink`
  return fetch(cbHost, { method: 'POST', body: JSON.stringify({ url }) })
}
