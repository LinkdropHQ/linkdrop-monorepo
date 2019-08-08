import axios from 'axios'

export default async ({ url }) => {
  const cbHost = 'https://rinkeby.linkdrop.io/api/v1/utils/get-coinbase-deeplink'
  const { data } = await axios.post(cbHost, { url })
  return data
}
