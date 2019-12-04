import { Connectors } from 'web3-react'
import { infuraPk, portisDappId, formaticApiKeyTestnet } from 'config'
import FortmaticApi from 'fortmatic'
import PortisApi from '@portis/web3'
import { getHashVariables, defineNetworkName } from '@linkdrop/commons'
const { chainId } = getHashVariables()
const networkName = defineNetworkName({ chainId })

const {
  InjectedConnector,
  FortmaticConnector,
  PortisConnector
} = Connectors

const MetaMask = new InjectedConnector({
  supportedNetworks: [3]
})

const supportedNetworkURLs = {
  3: `https://ropsten.infura.io/v3/${infuraPk}`
}

const Fortmatic = new FortmaticConnector({
  api: FortmaticApi,
  apiKey: formaticApiKeyTestnet,
  logoutOnDeactivation: true
})

const Portis = new PortisConnector({
  api: PortisApi,
  dAppId: portisDappId,
  network: networkName
})

const connectors = {
  MetaMask,
  Fortmatic,
  Portis
}
export default connectors
