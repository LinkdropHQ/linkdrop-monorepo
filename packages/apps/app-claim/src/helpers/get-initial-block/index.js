import config from 'app.config.js'
import { defineNetworkName } from '@linkdrop/commons'
import { capitalize } from 'helpers'

export default ({ chainId = '1' }) => {
  const networkName = capitalize({ string: defineNetworkName({ chainId }) })
  return config[`initialBlock${networkName}`]
}
