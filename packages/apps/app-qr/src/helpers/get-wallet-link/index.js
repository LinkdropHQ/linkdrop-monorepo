import wallets from 'wallets'

export default ({ platform, wallet, currentUrl }) => {
  if (wallet === 'coinbase') { return null }
  const walletObj = wallets[wallet]
  if (!walletObj) { return {} }
  if (!walletObj.mobile[platform].support) { return {} }
  const deepLink = walletObj.mobile[platform].deepLink
  if (!deepLink) { return {} }
  return deepLink(currentUrl)
}
