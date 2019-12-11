import { infuraPk, portisDappId, formaticApiKeyTestnet } from 'config'
import FortmaticApi from 'fortmatic'
import PortisApi from '@portis/web3'
import { getHashVariables, defineNetworkName } from '@linkdrop/commons'
const { chainId = '3' } = getHashVariables()
const networkName = defineNetworkName({ chainId })
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { InjectedConnector } from "@web3-react/injected-connector";

const MetaMask = new InjectedConnector({
  supportedChainIds: [3]
})

const Fortmatic = new FortmaticConnector({
  api: FortmaticApi,
  apiKey: formaticApiKeyTestnet,
  logoutOnDeactivation: true,
  chainId: 3
})

const Portis = new PortisConnector({
  api: PortisApi,
  dAppId: portisDappId,
  networks: [3]
})

const connectors = {
  MetaMask,
  Fortmatic,
  Portis
}

export default connectors
