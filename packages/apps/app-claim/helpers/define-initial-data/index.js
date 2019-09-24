const ls = (typeof window === 'undefined' ? {} : window).localStorage

export default ({ chainId }) => {
  const lsData = JSON.parse((ls && ls.getItem && ls.getItem('userData')) || '{}')
  const result = lsData[`_${chainId}`]
  if (result) { return result }
  return {}
}
