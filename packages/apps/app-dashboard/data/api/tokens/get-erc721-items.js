import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'
import { openSeaApiKey } from 'app.config.js'

export default ({ address, networkName, orderBy = 'current_price', direction = 'asc', page = 0 }) => {
  const getParams = prepareGetParams({
    owner: address,
    order_by: orderBy,
    order_direction: direction,
    offset: page * 50,
    limit: 50
  })
  const domainName = networkName === 'rinkeby' ? 'rinkeby-api.opensea.io' : 'api.opensea.io'
  const headers = {
    'X-API-KEY': openSeaApiKey || ''
  }
  return fetch(`https://${domainName}/api/v1/assets/${getParams}`, { headers })
}
