export default ({ chainId }) => NETWORK_IDS[`_${chainId}`]

const NETWORK_IDS = {
  _1: 'mainnet',
  _3: 'ropsten',
  _4: 'rinkeby',
  _5: 'goerli',
  _42: 'kovan',
  _100: 'xdai',
  _97: 'bsc-testnet'
}
