const routes = {
  '/linkdrops/claim': {
    post: {
      controller: 'claimController',
      method: 'claim'
    }
  },
  '/linkdrops/claim-erc721': {
    post: {
      controller: 'claimController',
      method: 'claimERC721'
    }
  },
  '/linkdrops/getStatus/:linkdropMasterAddress/:linkId': {
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
  '/linkdrops/getLastTxHash/:linkdropMasterAddress/:linkId': {
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
  '/linkdrops/claimAndDeploy': {
    post: {
      controller: 'claimController',
      method: 'claimAndDeploy'
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
