// import { Connectors } from 'web3-react'
// import { infuraPk, portisDappId, formaticApiKeyTestnet, formaticApiKeyMainnet } from 'app.config.js'
// import WalletConnectApi from '@walletconnect/web3-subprovider'
// import { getHashVariables, defineNetworkName } from '@linkdrop/commons'
// import { FortmaticConnector } from "@web3-react/fortmatic-connector"
// import { PortisConnector } from "@web3-react/portis-connector"
// const { chainId } = getHashVariables()
// const networkName = defineNetworkName({ chainId })

// const {
//   InjectedConnector,
//   NetworkOnlyConnector,
//   WalletConnectConnector
// } = Connectors

// const MetaMask = new InjectedConnector({
//   supportedNetworks: [1, 3, 4, 5, 42, 100]
// })

// const supportedNetworkURLs = {
//   1: `https://mainnet.infura.io/v3/${infuraPk}`,
//   4: `https://rinkeby.infura.io/v3/${infuraPk}`,
//   3: `https://ropsten.infura.io/v3/${infuraPk}`,
//   5: `https://goerli.infura.io/v3/${infuraPk}`,
//   42: `https://kovan.infura.io/v3/${infuraPk}`
// }

// const Network = new NetworkOnlyConnector({
//   providerURL: `https://${networkName}.infura.io/v3/${infuraPk}`
// })

// const WalletConnect = new WalletConnectConnector({
//   api: WalletConnectApi,
//   bridge: 'https://bridge.walletconnect.org',
//   supportedNetworkURLs,
//   defaultNetwork: Number(chainId)
// })

// const Fortmatic = new FortmaticConnector({
//   apiKey: Number(chainId) === 1 ? formaticApiKeyMainnet : formaticApiKeyTestnet,
//   logoutOnDeactivation: true,
//   chainId: Number(chainId)
// })

// const Portis = new PortisConnector({
//   dAppId: portisDappId,
//   networks: [Number(chainId)]
// })

// const connectors = {
//   MetaMask,
//   Network,
//   WalletConnect,
//   Fortmatic,
//   Portis
// }

// export default connectors


import { Connectors } from 'web3-react'
import { infuraPk, portisDappId, formaticApiKeyTestnet, formaticApiKeyMainnet } from 'app.config.js'
import WalletConnectApi from '@walletconnect/web3-subprovider'
import FortmaticApi from 'fortmatic'
import PortisApi from '@portis/web3'
import { getHashVariables, defineNetworkName } from '@linkdrop/commons'
const { chainId } = getHashVariables()
const networkName = defineNetworkName({ chainId })

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
  logoutOnDeactivation: true,
  defaultNetwork: Number(chainId),
  network: networkName
})

const Portis = new PortisConnector({
  api: PortisApi,
  dAppId: portisDappId,
  network: networkName
})

const connectors = {
  MetaMask,
  Network,
  WalletConnect,
  Fortmatic,
  Portis
}
export default connectors
