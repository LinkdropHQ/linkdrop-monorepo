import defineNetworkName from '../define-network-name'

export default ({ chainId = '1' }) => {
  if (Number(chainId) === 1) { return 'https://etherscan.io/' }
  if (Number(chainId) === 100) { return 'https://blockscout.com/poa/xdai/' }
  const networkName = defineNetworkName({ chainId })
  return `https://${networkName}.etherscan.io/`
}
