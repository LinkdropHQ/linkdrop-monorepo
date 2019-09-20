import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'

export default ({ wallet }) => {
  const getParams = prepareGetParams({
    address: wallet
  })
  return fetch(`https://ethereum-ray.trustwalletapp.com/tokens${getParams}`)
}
