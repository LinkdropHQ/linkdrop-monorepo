const _withoutProtocol = (url) => url.replace(/(^\w+:|^)\/\//, '')

export default {
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
    }
  },
  portis: {
    id: 'portis',
    name: 'Portis',
    walletURL: 'https://portis.io/',
    dappStoreUrl: 'https://wallet.portis.io/',
    mobile: {
      android: {
        support: false,
        deepLink: () => {}
      },
      ios: {
        support: false,
        deepLink: () => {}
      }
    }
  },
  opera: {
    id: 'opera',
    name: 'Opera',
    walletURL: 'https://play.google.com/store/apps/details?id=com.opera.browser',
    dappStoreUrl: 'https://www.opera.com/dapps-store',
    mobile: {
      android: {
        support: true,
        deepLink: (url) => `https://operacrypto.page.link/?link=${encodeURIComponent(url)}&apn=com.opera.browser`
      },
      ios: {
        support: true,
        deepLink: (url) => `https://operacrypto.page.link/?link=${encodeURIComponent(url)}&ibi=com.opera.OperaTouch&isi=411869974`
      }
    }
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
    }
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
    }
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
    }
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
    }
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
    }
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
    }
  }
}
