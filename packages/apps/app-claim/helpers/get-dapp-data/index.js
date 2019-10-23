import dapps from 'dapps'
export default ({ dappId }) => {
  const dappData = dapps[dappId]
  if (dappData) { return dappData }
}
