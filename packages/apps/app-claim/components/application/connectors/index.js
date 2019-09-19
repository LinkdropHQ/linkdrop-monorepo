import { Connectors } from 'web3-react'
const { InjectedConnector, NetworkOnlyConnector } = Connectors

const MetaMask = new InjectedConnector({
  supportedNetworks: [1, 3, 4, 5, 42]
})

const Infura = new NetworkOnlyConnector({
  providerURL: 'https://mainnet.infura.io'
})

export default { MetaMask, Infura }
