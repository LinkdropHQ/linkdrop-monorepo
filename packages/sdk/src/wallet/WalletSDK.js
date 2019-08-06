import { triggerSafeDeployment, deploySafe, getDeploymentTxHash } from './utils'
import LinkdropSDK from '../index'

class WalletSDK {
  //
  constructor (chain = 'rinkeby') {
    if (chain !== 'mainnet' && chain !== 'rinkeby') {
      throw new Error('Chain not supported')
    }
    this.chain = chain
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

  connect (safe) {
    this.safe = safe
  }

  async executeTx ({
    safe = this.safe,
    to,
    value,
    data,
    operation = '0',
    signature,
    gasToken = '0x0000000000000000000000000000000000000000'
  }) {
    let { safeTxGas, baseGas, gasPrice, nonce } = await getEstimationParams({
      safe,
      to,
      value,
      data,
      operation,
      gasToken
    })
  }
}

export default WalletSDK
