import fetch from '../fetch'

export default ({ address, email, networkName }) => {
	const host = `https://${networkName}.linkdrop.io/api/v1/users`
  return fetch(host, { method: 'POST', body: JSON.stringify({ address, email }) })
}
