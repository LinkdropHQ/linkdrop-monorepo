const ProviderEngine = require('web3-provider-engine')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions.js')

const ethers = require('ethers')

class Provider {
  constructor (opts) {
    console.log({ opts })
    this.ensName = opts.ensName
    this.rpcUrl = opts.rpcUrl
    this.network = opts.network || 'mainnet'
    
    if (!opts.ensName) {
      throw new Error('ENS name should be provided')
    }
    
    if (!opts.rpcUrl) {
      throw new Error('rpcUrl should be provided')
    }
    
    if (!opts.network) {
      throw new Error('network should be provided')
    }
    
    this.provider = this._initProvider()
  }

  async _getAddressFromEns (ensName, network) {
    let address
    try {
      const provider = ethers.getDefaultProvider(network)
      address = await provider.resolveName(ensName)
      console.log({ address })
    } catch (err) {
      throw new Error('Bad ENS name provided')
    }
    return address
  }

  _parseDomain (ensName) {
    return ensName.split(/\.(.*)/).slice(0, 2)
  }
  
  
  _getConfirmationUrlFromEns (ensName) {
    const [ label, domain ] = this._parseDomain(ensName)
    console.log({ label, domain })
    if (domain === 'argent.xyz') {
      return 'https://argent.xyz'
    } else {
      return 'http://localhost:9002/#/confirm'
    }
  }
  
  _initProvider () {
    const engine = new ProviderEngine()
    let address
    let confirmationUrl
    
    engine.enable = async () => {
      address = await this._getAddressFromEns(this.ensName, this.network)
      confirmationUrl = this._getConfirmationUrlFromEns(this.ensName)
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
          throw new Error('eth_chainId call not implemented')
        case 'net_version':
          throw new Error('net_version call not implemented')
        case 'eth_uninstallFilter':
          engine.Async(payload, _ => _)
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
      web3_clientVersion: `UL/v${VERSION}/javascript`,
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
        console.log('publihshing transaction')

        const receiveMessage = (event) => {
          // Do we trust the sender of this message?
          if (event.origin !== confirmationUrl) return

          if (event.data.action === 'PASS_TRANSACTION_RESULT') {
            const { success, txHash } = event.data.payload
            console.log('Got txHash ', txHash)
            if (cache[txHash]) {
              console.log('Got the same message result, skipping...')
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
        
        const newWindow = window.open(confirmationUrl, '_blank')
        console.log('sending transaction')
        setTimeout(() => {
          const data = { action: 'SEND_TRANSACTION', payload: { txParams } }
          newWindow.postMessage(data, confirmationUrl)
        }, 1000)
      }
    })
    
    /* ADD MIDDELWARE (PRESERVE ORDER) */
    engine.addProvider(fixtureSubprovider)
    engine.addProvider(cacheSubprovider)
    engine.addProvider(walletSubprovider)
    engine.addProvider(new RpcSubprovider({ rpcUrl: this.rpcUrl }))
    engine.addProvider(new SubscriptionsSubprovider())
    engine.addProvider(new FilterSubprovider())
    /* END OF MIDDLEWARE */
    
    engine.addProvider({
      handleRequest: async (payload, next, end) => {
        try {
          console.log('got request ', payload.method)
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

    engine.isEnsLogin = true
    engine.on = false
    
    console.log('engine is inited')
    engine.start()
    return engine
  }
}

export default Provider
