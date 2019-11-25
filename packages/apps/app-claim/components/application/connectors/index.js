import { Connectors } from 'web3-react'
import { infuraPk, portisDappId, formaticApiKeyTestnet, formaticApiKeyMainnet } from 'app.config.js'
import WalletConnectApi from '@walletconnect/web3-subprovider'
import FortmaticApi from 'fortmatic'
import PortisApi from '@portis/web3'
import { AuthereumConnector } from '@web3-react/authereum-connector'
import { getHashVariables, defineNetworkName, definePlatform } from '@linkdrop/commons'
const { chainId } = getHashVariables()
const networkName = defineNetworkName({ chainId })
const platform = definePlatform()

const {
  InjectedConnector,
  NetworkOnlyConnector,
  WalletConnectConnector,
  FortmaticConnector,
  PortisConnector
} = Connectors

const MetaMask = new InjectedConnector({
  supportedNetworks: [1, 3, 4, 5, 42, 100]
})

const supportedNetworkURLs = {
  1: `https://mainnet.infura.io/v3/${infuraPk}`,
  4: `https://rinkeby.infura.io/v3/${infuraPk}`,
  3: `https://ropsten.infura.io/v3/${infuraPk}`,
  5: `https://goerli.infura.io/v3/${infuraPk}`,
  42: `https://kovan.infura.io/v3/${infuraPk}`
}

const Network = new NetworkOnlyConnector({
  providerURL: `https://${networkName}.infura.io/v3/${infuraPk}`
})

const WalletConnect = new WalletConnectConnector({
  api: WalletConnectApi,
  bridge: 'https://bridge.walletconnect.org',
  supportedNetworkURLs,
  defaultNetwork: Number(chainId)
})

const Fortmatic = new FortmaticConnector({
  api: FortmaticApi,
  apiKey: Number(chainId) === 1 ? formaticApiKeyMainnet : formaticApiKeyTestnet,
  logoutOnDeactivation: false
})

const Portis = new PortisConnector({
  api: PortisApi,
  dAppId: portisDappId,
  network: networkName
})

export const authereum = new AuthereumConnector({ chainId: Number(chainId) })
const connectors = platform === 'desktop' ? {
  MetaMask,
  Network,
  WalletConnect,
  Fortmatic,
  Portis
} : {
  MetaMask,
  Network
}
export default connectors
