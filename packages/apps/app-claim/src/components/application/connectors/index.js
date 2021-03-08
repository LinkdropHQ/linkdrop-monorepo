import { infuraPk, portisDappId, formaticApiKeyTestnet, formaticApiKeyMainnet } from 'app.config.js'
import { getHashVariables, defineNetworkName } from '@linkdrop/commons'

import { NetworkConnector } from "@web3-react/network-connector";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { PortisConnector } from "@web3-react/portis-connector";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'


const { chainId } = getHashVariables()
// const networkName = defineNetworkName({ chainId })
const POLLING_INTERVAL = 12000
const Metamask = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 100, 97]
})

const supportedNetworkURLs = {
  1: `https://mainnet.infura.io/v3/${infuraPk}`,
  4: `https://rinkeby.infura.io/v3/${infuraPk}`,
  3: `https://ropsten.infura.io/v3/${infuraPk}`,
  5: `https://goerli.infura.io/v3/${infuraPk}`,
  42: `https://kovan.infura.io/v3/${infuraPk}`,
  // 97: 'https://data-seed-prebsc-1-s1.binance.org:8545/'
}

const Network = new NetworkConnector({
  urls: supportedNetworkURLs,
  defaultChainId: Number(chainId)
})

const walletConnectRpc = {
  [Number(chainId)]: supportedNetworkURLs[Number(chainId)]
}

const Walletconnect = new WalletConnectConnector({
  rpc: walletConnectRpc,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

const connectors = {
  Metamask,
  Network,
  Walletconnect
}

if (supportedNetworkURLs[Number(chainId)]) {
  const Fortmatic = new FortmaticConnector({
    apiKey: Number(chainId) === 1 ? formaticApiKeyMainnet : formaticApiKeyTestnet,
    logoutOnDeactivation: true,
    chainId: Number(chainId)
  })  
  connectors.Fortmatic = Fortmatic

   const Portis = new PortisConnector({
    dAppId: portisDappId,
    networks: [Number(chainId)]
  })

  connectors.Portis = Portis
}

export default connectors
