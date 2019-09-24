const ls = (typeof window === 'undefined' ? {} : window).localStorage

export default ({ chainId, privateKey, contractAddress, ens, avatar }) => {
  const lsData = JSON.parse((ls && ls.getItem && ls.getItem('userData')) || '{}')
  lsData[`_${chainId}`] = {
    privateKey,
    contractAddress,
    ens
  }
  if (ls && ls.setItem) {
    ls.setItem('avatar', avatar)
    ls.setItem('userData', JSON.stringify(lsData))
  }
}
