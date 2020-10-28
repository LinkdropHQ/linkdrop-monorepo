import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'

export default ({ address, networkName }) => {
  const getParams = prepareGetParams({
    address,
    action: 'tokenlist',
    module: 'account'
  })
  const apiPrefix = networkName === 'xdai' ? 'poa' : 'etc'
  return fetch(`https://blockscout.com/${apiPrefix}/${networkName}/api${getParams}`)
}
