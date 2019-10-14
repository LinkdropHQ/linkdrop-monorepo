export default ({ chainId }) => {
  if (Number(chainId) === 100) { return 'xDAI' }
  return 'ETH'
}
