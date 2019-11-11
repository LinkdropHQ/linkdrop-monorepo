const routes = {
  '/linkdrops/claim': {
    post: {
      controller: 'claimController',
      method: 'claim'
    }
  },
  '/linkdrops/getStatus/:linkdropContractAddress/:linkId': {
    get: {
      controller: 'claimController',
      method: 'getStatus'
    }
  },
  '/linkdrops/cancel': {
    post: {
      controller: 'claimController',
      method: 'cancel'
    }
  },
  '/linkdrops/getLastTxHash/:linkdropContractAddress/:linkId': {
    get: {
      controller: 'lastTxHashController',
      method: 'getLastTxHash'
    }
  },
  '/linkdrops/getLastTxHash/:id': {
    get: {
      controller: 'lastTxHashController',
      method: 'getLastTxHashById'
    }
  },
  '/utils/get-coinbase-deeplink': {
    post: {
      controller: 'utilsController',
      method: 'getCoinbaseDeepLink'
    }
  }
}

module.exports = routes
