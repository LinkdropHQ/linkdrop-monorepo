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
  }
}

module.exports = routes
