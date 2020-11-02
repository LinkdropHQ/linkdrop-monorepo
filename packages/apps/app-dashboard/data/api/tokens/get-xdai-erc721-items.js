import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'

export default ({ address }) => {
  const getParams = prepareGetParams({
    address,
    action: 'tokenlist',
    module: 'account'
  })
  return fetch(`https://blockscout.com/poa/xdai/api${getParams}`)
}
