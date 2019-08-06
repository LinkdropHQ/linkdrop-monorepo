import { triggerSafeDeployment, estimateTx, executeTx } from './utils'

class WalletSDK {
  //
  constructor (chain = 'rinkeby', safe = null, privateKey = null) {
    if (chain !== 'mainnet' && chain !== 'rinkeby') {
      throw new Error('Chain not supported')
    }
    this.chain = chain
    this.connect({ safe, privateKey })
    this.baseURL =
      chain === 'mainnet'
        ? 'https://safe-relay.gnosis.pm/api'
        : 'https://safe-relay.rinkeby.gnosis.pm/api'
  }

  async getAddress ({ owners, threshold, saltNonce }) {
    try {
      const response = await triggerSafeDeployment(
        {
          owners,
          threshold,
          saltNonce
        },
        this.baseURL
      )
      return response.data.safe
    } catch (error) {
      if (error.response) {
        console.log(error.response.data)
        console.log(error.response.status)
      }
      throw new Error('Error occured while triggering Safe deployment')
    }
  }

  connect ({ privateKey, safe }) {
    this.privateKey = privateKey
    this.safe = safe
  }

  _checkConnect () {
    if (!this.privateKey) {
      throw new Error('This action requires a connected private key')
    }
    if (!this.safe) {
      throw new Error('This action requires a connected safe')
    }
  }

  async executeTransaction ({
    to,
    value,
    data, // optional
    operation, // optional
    gasToken // optional
  }) {
    this._checkConnect()

    const { safeTxGas, baseGas, gasPrice, nonce } = await estimateTx({
      safe: this.safe,
      to,
      value,
      data,
      operation,
      gasToken
    })

    const response = await executeTx({
      to,
      value,
      data,
      operation,
      gasToken,
      safeTxGas,
      baseGas,
      gasPrice,
      nonce,
      safe: this.safe,
      privateKey: this.privateKey
    })

    console.log({ response })
    return response
  }
}

export default WalletSDK
