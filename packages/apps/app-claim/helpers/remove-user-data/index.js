const ls = (typeof window === 'undefined' ? {} : window).localStorage

export default ({ chainId }) => {
  const lsData = JSON.parse((ls && ls.getItem && ls.getItem('userData')) || '{}')
  lsData[`_${chainId}`] = undefined
  if (ls && ls.setItem) {
    ls.setItem('userData', JSON.stringify(lsData))
  }
}
