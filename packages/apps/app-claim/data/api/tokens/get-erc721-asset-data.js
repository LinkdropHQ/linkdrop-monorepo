import fetch from '../fetch'

export default ({ tokenAddress, tokenId }) => {
	return fetch(`https://api.opensea.io/asset/${tokenAddress}/${tokenId}`)
}
