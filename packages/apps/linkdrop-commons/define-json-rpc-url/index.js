import defineNetworkName from '../define-network-name'

export default ({ chainId, infuraPk }) => {
  const networkName = defineNetworkName({ chainId })
  // if (networkName === 'xdai' || networkName === 'bsc-testnet') { return jsonRpcUrlCustom }

  if (String(chainId) === '100') {
    return 'https://rpc.xdaichain.com/'
  } else if (String(chainId) === '97') {
    return 'https://data-seed-prebsc-1-s1.binance.org:8545/'
  } else if (String(chainId) === '56') {
    return 'https://bsc-dataseed.binance.org'
  } else if (String(chainId) === '137') {
    return 'https://rpc-mainnet.maticvigil.com'
  }
  
  return `https://${networkName}.infura.io/v3/${infuraPk}`
}
