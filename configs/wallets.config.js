const _withoutProtocol = (url) => url.replace(/(^\w+:|^)\/\//, '')

export default {
  fortmatic: {
    id: 'fortmatic',
    name: 'Fortmatic',
    chains: ['1']
  },
  metamask: {
    id: 'metamask',
    name: 'Metamask',
    chains: ['100']
  },  
  portis: {
    id: 'portis',
    name: 'Portis',
    chains: ['1', '2']
  },
  trust: {
    id: 'trust',
    name: 'Trust Wallet',
    walletURL: 'https://trustwalletapp.com',
    dappStoreUrl: 'https://dapps.trustwalletapp.com/',
    mobile: {
      android: {
        support: true,
        deepLink: (url) => `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(url)}`
      },
      ios: {
        support: true,
        deepLink: (url) => `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(url)}`
      }
    },
    chains: ['1']
  },
  opera: {
    id: 'opera',
    name: 'Opera',
    walletURL: 'https://www.opera.com/mobile/operabrowser',
    walletURLIos: 'https://www.opera.com/mobile/touch',
    dappStoreUrl: 'https://www.opera.com/dapps-store',
    mobile: {
      android: {
        support: true,
        deepLink: (url) => `https://operacrypto.page.link/?link=${encodeURIComponent(url)}&efr=1&apn=com.opera.browser`
      },
      ios: {
        support: true,
        deepLink: (url) => `https://operacrypto.page.link/?link=${encodeURIComponent(url)}&efr=1&ibi=com.opera.OperaTouch&isi=1411869974`
      }
    },
    chains: ['1', '3', '4']
  },
  status: {
    id: 'status',
    name: 'Status',
    walletURL: 'https://status.im/',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: true,
        deepLink: url => `https://get.status.im/browse/${_withoutProtocol(url)}`
      },
      ios: {
        support: true,
        deepLink: url => `https://get.status.im/browse/${_withoutProtocol(url)}`
      }
    },
    chains: ['1', '3', '4']
  },
  tokenpocket: {
    id: 'token_pocket',
    name: 'Token Pocket',
    walletURL: 'https://tokenpocket.jp/en/',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: false,
        deepLink: (url) => null
      },
      ios: {
        support: true,
        deepLink: url => `https://tokenpocket.github.io/applink?dappUrl=${encodeURIComponent(url)}`
      }
    },
    chains: ['1', '3', '4']
  },
  coinbase: {
    id: 'coinbase_wallet',
    name: 'Coinbase Wallet',
    walletURL: 'https://www.toshi.org',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: false,
        deepLink: (url) => null
      },
      ios: {
        support: false,
        deepLink: (url) => null
      }
    },
    chains: ['1', '3', '4']
  },
  imtoken: {
    id: 'imtoken',
    name: 'imToken',
    walletURL: 'https://token.im/',
    dappStoreUrl: 'https://dapps.trustwalletapp.com/',
    mobile: {
      android: {
        support: true,
        deepLink: url =>
          `imtokenv2://navigate/DappView?url=${encodeURIComponent(url)}`
      },
      ios: {
        support: true,
        deepLink: url =>
          `imtokenv2://navigate/DappView?url=${encodeURIComponent(url)}`
      }
    },
    chains: ['1', '3', '4']
  },
  gowallet: {
    id: 'gowallet',
    name: 'GoWallet',
    walletURL: null,
    dappStoreUrl: null,
    mobile: {
      android: {
        support: false,
        deepLink: (url) => null
      },
      ios: {
        support: false,
        deepLink: (url) => null
      }
    },
    chains: ['1', '3', '4']
  },
  buntoy: {
    id: 'buntoy',
    name: 'Buntoy',
    walletURL: 'https://www.buntoy.com/buntoy.html',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: false,
        deepLink: (url) => null
      },
      ios: {
        support: false,
        deepLink: (url) => null
      }
    },
    chains: ['1', '3', '4']
  },
  burner2: {
    id: 'burner2',
    name: 'Burner Wallet 2',
    walletURL: 'https://linkdrop-test.burnerfactory.com/linkdrop',
    dappStoreUrl: null,
    mobile: {
      android: {
        support: false,
        deepLink: (url) => null
      },
      ios: {
        support: false,
        deepLink: (url) => null
      }
    },
    chains: ['100']
  }
}
