import defineNetworkName from '../define-network-name'

export default ({ chainId = '1' }) => {
  if (Number(chainId) === 1) { return 'https://etherscan.io/' }
  const networkName = defineNetworkName({ chainId })
  return `https://${networkName}.etherscan.io/`
}
