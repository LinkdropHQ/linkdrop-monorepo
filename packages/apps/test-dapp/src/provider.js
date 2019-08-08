import qs from 'querystring'
const ProviderEngine = require('web3-provider-engine')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions.js')
const ethers = require('ethers')

class Provider {
  constructor () {
    const address = this._getAddressFromUrl()
    this.provider = this._initProvider({ address })
  }

  _getAddressFromUrl () {
    let address = null
    const paramsFragment = document.location.search.substr(1)
    if (paramsFragment) {
      try {
        const query = qs.parse(paramsFragment)
        address = query.address
        address = ethers.utils.getAddress(address)
        console.log({ address })
      } catch (err) {
        console.log('bad address')
        address = null
      }
    }
    return address
  }
  
  _initProvider ({ address }) {
    const engine = new ProviderEngine()

    engine.send = (payload, callback) => {
      // Web3 1.0 beta.38 (and above) calls `send` with method and parameters
      if (typeof payload === 'string') {
        return new Promise((resolve, reject) => {
          engine.sendAsync(
            {
              jsonrpc: '2.0',
              id: 42,
              method: payload,
              params: callback || []
            },
            (error, response) => {
              if (error) {
                reject(error)
              } else {
                resolve(response.result)
              }
            }
          )
        })
      }

      // Web3 1.0 beta.37 (and below) uses `send` with a callback for async queries
      if (callback) {
        engine.sendAsync(payload, callback)
        return
      }

      let result
      switch (payload.method) {
      case 'eth_accounts':
        result = 'accounts'
        throw new Error('Not imlemented')
        break

      case 'eth_coinbase':
        result = 'coinbase'
        throw new Error('Not imlemented')   
        break
      case 'net_version':
        result = 'net_version'
        throw new Error('Not imlemented')
        break

      case 'eth_uninstallFilter':
        engine.sendAsync(payload, _ => _)
        result = true
        throw new Error('Not imlemented')
        break

      default:
        var message = `Card Web3 object does not support synchronous methods like ${
          payload.method
        } without a callback parameter.`
        throw new Error(message)
      }

      return {
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result: result
      }
    }

    engine.addProvider(
      new FixtureSubprovider({
        web3_clientVersion: `Card/v0.0.1/javascript`,
        net_listening: true,
        eth_hashrate: '0x00',
        eth_mining: false,
        eth_syncing: true
      })
    )

    engine.addProvider(new CacheSubprovider())
    engine.addProvider(new SubscriptionsSubprovider())
    engine.addProvider(new FilterSubprovider())
    engine.addProvider(new NonceSubprovider())

    engine.addProvider(
      new HookedWalletSubprovider({
        getAccounts: cb => {
          console.log('in getAccounts hooked')
          const result = [address]
          const error = null
          cb(error, result)
        }
      })
    )
    
    // engine.addProvider({
    //   setEngine: _ => _,
    //   /////// handleRequest: async (payload, next, end) => {
    //   ///////   const error = null
    //   ///////   const result = null
    //   ///////   end(error, result)
    //   /////// }
    // })

    engine.enable = () =>
      new Promise((resolve, reject) => {
        engine.sendAsync({ method: 'eth_accounts' }, (error, response) => {
          console.log('in send async get accounts')
          if (error) {
            reject(error)
          } else {
            resolve(response.result)
          }
        })
      })

    engine.isConnected = () => {
      return true
    }

    engine.isCard = true

    engine.on('error', error => {
      if (error && error.message && error.message.includes('PollingBlockTracker')) {
        // console.warn('If you see this warning constantly, there might be an error with your RPC node.')
      } else {
        console.error(error)
      }
    })
    
    console.log('engine is inited')
    engine.start()
    return engine
  }
}

export default Provider
