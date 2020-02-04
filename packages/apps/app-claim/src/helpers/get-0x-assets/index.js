export default ({ assets = [] }) => {
	const erc721 = assets.find(asset => asset.type === 'erc721')
  const erc20 = assets.find(asset => asset.type === 'erc20')
  if (!erc721 && !erc20) { return {} }
  if (erc721 && !erc20) {
  	return `${erc721.symbol} NFT`
  }
  if (!erc721 && erc20) {
  	return `${erc20.amount} ${erc20.symbol}`
  }
  return `${erc20.amount} ${erc20.symbol} + ${erc721.symbol} NFT`
}