const routes = {
  '/linkdrops/claim': {
    post: {
      controller: 'claimController',
      method: 'claim'
    }
  },
  '/linkdrops/claimAndDeploy': {
    post: {
      controller: 'claimController',
      method: 'claimAndDeploy'
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
  '/linkdrops/deploy': {
    post: {
      controller: 'factoryController',
      method: 'deploy'
    }
  },
  '/linkdrops/register': {
    post: {
      controller: 'factoryController',
      method: 'register'
    }
  },
  '/linkdrops/withdraw': {
    post: {
      controller: 'factoryController',
      method: 'withdraw'
    }
  },
  '/linkdrops/isDeployed/:senderAddress/:campaignId': {
    get: {
      controller: 'factoryController',
      method: 'isDeployed'
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
