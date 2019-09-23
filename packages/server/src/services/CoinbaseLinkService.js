import axios from 'axios'
import configs from '../../../../configs'
const config = configs.get('server')

export const fetchCoinbaseDeepLink = async ({ url }) => {
    console.log({ url })
  const options = {
        url: config.COINBASE_DEEP_LINKING_SERVER,
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*',
          Accept: 'application/json',
          'Content-Type': 'text/json'
        },
        auth: {
          username: config.COINBASE_DEEP_LINKING_USERNAME,
          password: config.COINBASE_DEEP_LINKING_PASSWORD
        },
    data: { url }
  }
  const { data } = await axios(options)
  return data.result.url
}
