import qs from 'querystring'
const ProviderEngine = require('web3-provider-engine')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
// const NonceSubprovider = require('web3-provider-engine/subproviders/nonce-tracker.js')
const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions.js')

const ethers = require('ethers')

const WALLET_URL = 'http://localhost:3000'

class Provider {
  constructor () {
    this.provider = this._initProvider()
  }
  
  _getParamsUrl () {
    let ensName, network
    const paramsFragment = document.location.search.substr(1)
    if (paramsFragment) {
        const query = qs.parse(paramsFragment)
        network = query.network || 'mainnet'
        ensName = query.user
        console.log({ ensName, network })
    }
    return { ensName, network }
  }

  async _getAddress (ensName, network) {
    let address
  try {
    const provider = ethers.getDefaultProvider(network)
    address = await provider.resolveName(ensName)
    console.log({ address })
  } catch (err) {
    console.log('bad address')
    address = null
  }
  return address
}
  
  _initProvider () {
    const engine = new ProviderEngine()
    let address
    const { ensName, network } = this._getParamsUrl()
    
    engine.enable = async () => {
      address = await this._getAddress(ensName, network)
    }

    async function handleRequest (payload) {
      let result = null
      try {
        switch (payload.method) {
        case 'eth_accounts':
          result = [address]
          break

        case 'eth_coinbase':
          result = address
          break
        case 'eth_chainId':
          throw new Error("eth_chainId call not implemented")
          // result = walletConnector.chainId
          // break
        case 'net_version':
          throw new Error("net_version call not implemented")
          // result = walletConnector.networkId || walletConnector.chainId
          // break
        case 'eth_uninstallFilter':
          engine.sendAsync(payload, _ => _)
          result = true
          break

        default:
          var message = `Card Web3 object does not support synchronous methods like ${
            payload.method
          } without a callback parameter.`
          throw new Error(message)
        }
      } catch (error) {
        throw error
      }

      return {
        id: payload.id,
        jsonrpc: payload.jsonrpc,
        result: result
      }
    }
    
    engine.send = async (payload, callback) => {
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
      
      const res = await handleRequest(payload, callback)
      return res
    }
    const VERSION = 0.1 // #TODO move to auto
    const fixtureSubprovider = new FixtureSubprovider({
      web3_clientVersion: `Squarelink/v${VERSION}/javascript`,
      net_listening: true,
      eth_hashrate: '0x00',
      eth_mining: false,
      eth_syncing: true
    })
    // const nonceSubprovider = new NonceSubprovider()
    const cacheSubprovider = new CacheSubprovider()

    // hack to deal with multiple received messages via PostMessage
    const cache = {}
    
    const walletSubprovider = new HookedWalletSubprovider({
      getAccounts: cb => {
        console.log('in getAccounts hooked')
        const result = [address]
        const error = null
        cb(error, result)
      },
      processTransaction: (txParams, cb) => {
        console.log("publihshing transaction")

        const receiveMessage = (event) => {            
          // Do we trust the sender of this message?
          if (event.origin !== WALLET_URL) return

          if (event.data.action === 'PASS_TRANSACTION_RESULT') {            
            const { success, txHash } = event.data.payload
            console.log("Got txHash ", txHash)
            if (cache[txHash]) {
              console.log("Got the same message result, skipping...")
              return null
            }
            cache[txHash] = true
            if (success) {
              cb(null, txHash)
            } else {
              const error = 'Transaction was rejected by user'
              cb(error)
            }
          }
        }

        window.addEventListener('message', receiveMessage, false)
        
        const newWindow = window.open(WALLET_URL, '_blank')
        console.log('sending transaction')
        setTimeout(() => {
          const message = { action: 'SEND_TRANSACTION' }
          newWindow.postMessage(message, WALLET_URL)
        }, 1000)
      }
    })
    
    /* ADD MIDDELWARE (PRESERVE ORDER) */
    engine.addProvider(fixtureSubprovider)
    // engine.addProvider(nonceSubprovider)
    engine.addProvider(cacheSubprovider)
    engine.addProvider(walletSubprovider)
    const rpcUrl = `https://${network}.infura.io/v3/d4d1a2b933e048e28fb6fe1abe3e813a`
    console.log({ rpcUrl })
    engine.addProvider(new RpcSubprovider({ rpcUrl }))
    engine.addProvider(new SubscriptionsSubprovider())
    engine.addProvider(new FilterSubprovider())
    /* END OF MIDDLEWARE */
    
    engine.addProvider({
      handleRequest: async (payload, next, end) => {
        try {
          // if (payload.method === 'eth_subscribe') {
          //    end(null, null)
          // }
          console.log("got request ", payload.method)
          const { result } = await handleRequest(payload)
          end(null, result)
        } catch (error) {
          end(error)
        }
      },
      setEngine: _ => _
    })
    

    
    engine.isConnected = () => {
      return true
    }

    engine.isCard = true

    // engine.on('error', error => {
    //   if (error && error.message && error.message.includes('PollingBlockTracker')) {
    //     console.warn('If you see this warning constantly, there might be an error with your RPC node.')
    //   } else {
    //     console.error(error)
    //   }
    // })

    engine.on = false
    
    console.log('engine is inited')
    engine.start()
    return engine
  }
}

export default Provider
