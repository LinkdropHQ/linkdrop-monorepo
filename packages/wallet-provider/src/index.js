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
    this.widgetUrl = opts.widgetUrl || 'http://localhost:9002'

    if (!opts.ensName) {
      throw new Error('ENS name should be provided')
    }

    if (!opts.network) {
      throw new Error('network should be provided')
    }
    this.provider = this._initProvider()
  }

  _addWidgetIcon () {
    const iconEl = document.createElement('div')
    iconEl.className = 'ld-widget-icon'
    document.body.appendChild(iconEl)

    iconEl.addEventListener('click', (event) => {
      // Log the clicked element in the console
      console.log(event.target)

      // hide or show widget window
      this._toggleWidget()
    }, false)
  }

  async _toggleWidget () {
    const currentIsBlock = this.widget.iframe.style.display === 'block'
    this.widget.iframe.style.display = currentIsBlock ? 'none' : 'block'
    this.toggleOpenIconClass(!currentIsBlock)
  }

  toggleOpenIconClass (widgetOpened) {
    const container = this.widget.iframe.closest('body').querySelector('.ld-widget-icon')
    if (widgetOpened) {
      return container.classList.add('ld-widget-icon-opened')
    }
    return container.classList.remove('ld-widget-icon-opened')
  }

  _initWidget () {
    return new Promise((resolve, reject) => {
      const onload = async () => {
        const container = document.createElement('div')
        container.className = 'ld-widget-container'

        const style = document.createElement('style')
        style.innerHTML = styles

        const iframe = document.createElement('iframe')

        let iframeSrc = this.widgetUrl

        // propagate claim params to iframe window
        if (window.location.hash.indexOf('#/receive') > -1) {
          iframeSrc += window.location.hash
        }

        iframe.src = iframeSrc
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
    if (this.widget) {
      this.widget.iframe.style.display = 'block'
      this.toggleOpenIconClass(true)
    }
  }

  _hideWidget () {
    if (this.widget) {
      this.widget.iframe.style.display = 'none'
      this.toggleOpenIconClass(false)
    }
  }

  async _initWidgetFrame () {
    this.widget = await this._initWidget()
    this._addWidgetIcon()
  }

  _initProvider () {
    const engine = new ProviderEngine()
    let address

    engine.enable = async () => {
      await this._initWidgetFrame()

      // this._showWidget()
      try {
        await this.widget.communication.connect()
        // this._hideWidget()
      } catch (err) {
        /// this._hideWidget()
        throw err
      }
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
          console.log({ result })
          address = result[0]
        } catch (err) {
          error = err
        }
        cb(error, result)
      },
      processTransaction: async (txParams, cb) => {
        let result, error
        try {
          const { txHash, success, errors } = await this.widget.communication.sendTransaction(txParams)
          if (success) {
            result = txHash
          } else {
            error = errors[0] || 'Error while sending transaction'
          }
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
