import defineNetworkName from '../define-network-name'

export default ({ chainId, infuraPk, jsonRpcUrlXdai }) => {
  console.log({ chainId })
  const networkName = defineNetworkName({ chainId })
  if (networkName === 'xdai') { return jsonRpcUrlXdai }
  return `https://${networkName}.infura.io/v3/${infuraPk}`
}
