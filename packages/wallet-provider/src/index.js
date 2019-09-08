import connectToChild from 'penpal/lib/connectToChild'
import { styles } from './styles'
const ProviderEngine = require('web3-provider-engine')
const RpcSubprovider = require('web3-provider-engine/subproviders/rpc')
const CacheSubprovider = require('web3-provider-engine/subproviders/cache.js')
const FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js')
const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js')
const HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js')
const SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions.js')

class Provider {
  constructor (opts) {
    this.ensName = opts.ensName
    this.network = opts.network || 'mainnet'
    this.rpcUrl = opts.rpcUrl || `https://${this.network}.infura.io/v3/d4d1a2b933e048e28fb6fe1abe3e813a`
    this.confirmUrl = opts.confirmUrl
    
    if (!opts.ensName) {
      throw new Error('ENS name should be provided')
    }
    
    if (!opts.network) {
      throw new Error('network should be provided')
    }
    this.widget = null
    this.provider = this._initProvider()
  }

  _initWidget () {
    return new Promise((resolve, reject) => {
      const onload = async () => {
        const style = document.createElement('style')
        style.innerHTML = styles

        const container = document.createElement('div')
        container.className = 'ld-widget-container'
                
        const iframe = document.createElement('iframe')
        iframe.src = 'http://localhost:9002/#/widget'
        iframe.className = 'ld-widget-iframe'
        
        container.appendChild(iframe)
        document.body.appendChild(container)
        document.head.appendChild(style)

        const connection = connectToChild({
          // The iframe to which a connection should be made
          iframe,
          // Methods the parent is exposing to the child
          methods: {
            showWidget: this._showWidget.bind(this),
            hideWidget: this._hideWidget.bind(this)
          }
        })

        const communication = await connection.promise
        resolve({ iframe, communication })
      }
      
      if (['loaded', 'interactive', 'complete'].indexOf(document.readyState) > -1) {
        onload()
      } else {
        window.addEventListener('load', onload.bind(this), false)
      }
    })
  }

  _showWidget () {
    this.widget.iframe.style.display = 'block'
  }

  _hideWidget () {
    this.widget.iframe.style.display = 'none'
  }
  
  _initProvider () {
    const engine = new ProviderEngine()
    let address
    
    engine.enable = async () => {
      this.widget = await this._initWidget()
      await this.widget.communication.connect()
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
      web3_clientVersion: `LD/v${VERSION}/javascript`,
      net_listening: true,
      eth_hashrate: '0x00',
      eth_mining: false,
      eth_syncing: true
    })
    // const nonceSubprovider = new NonceSubprovider()
    const cacheSubprovider = new CacheSubprovider()

    // hack to deal with multiple received messages via PostMessage
    const walletSubprovider = new HookedWalletSubprovider({
      getAccounts: async cb => {
        let result, error
        try {
          result = await this.widget.communication.getAccounts()
        } catch (err) {
          error = err
        }
        cb(error, result)
      },
      processTransaction: async (txParams, cb) => {
        // const receiveMessage = (event) => {
        //   // Do we trust the sender of this message?
        //   // if (event.origin !== confirmationUrl) return
        //   if (event.origin !== confirmationUrl.substring(event.origin.length, -1)) return

        //   if (event.data.action === 'PASS_TRANSACTION_RESULT') {
        //     const { success, txHash } = event.data.payload
        //     if (cache[txHash]) {
        //       return null
        //     }
        //     cache[txHash] = true
        //     if (success) {
        //       cb(null, txHash)
        //     } else {
        //       const error = 'Transaction was rejected by user'
        //       cb(error)
        //     }
        //   }
        // }
        // window.addEventListener('message', receiveMessage, false)
        // const newWindow = window.open(confirmationUrl, '_blank')
        // setTimeout(() => {
        //   const data = { action: 'SEND_TRANSACTION', payload: { txParams } }
        //   newWindow.postMessage(data, confirmationUrl)
        // }, 1000)
        
        let result, error
        try {
          result = await this.widget.communication.sendTransaction(txParams)
        } catch (err) {
          error = err
        }
        cb(error, result)
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
    engine.start()
    return engine
  }
}

export default Provider
