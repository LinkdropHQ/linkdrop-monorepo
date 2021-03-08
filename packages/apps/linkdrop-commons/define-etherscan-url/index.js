import defineNetworkName from '../define-network-name'

export default ({ chainId = '1' }) => {
  if (Number(chainId) === 1) { return 'https://etherscan.io/' }
  if (Number(chainId) === 100) { return 'https://blockscout.com/poa/xdai/' }
  if (Number(chainId) === 97) { return 'https://testnet.bscscan.com/' }  
  const networkName = defineNetworkName({ chainId })
  return `https://${networkName}.etherscan.io/`
}
