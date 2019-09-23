import fetch from '../fetch'
import { prepareGetParams } from 'data/api/helpers'

export default ({ account }) => {
  const getParams = prepareGetParams({
    address: account
  })
  return fetch(`https://ethereum-ray.trustwalletapp.com/tokens${getParams}`)
}
