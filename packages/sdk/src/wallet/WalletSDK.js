import UniversalLoginSDK from '@universal-login/sdk'

class WalletSDK {
  constructor (chain = 'rinkeby') {
    if (chain !== 'mainnet' && chain !== 'rinkeby') {
      throw new Error('Chain not supported')
    }

    this.chain = chain

    this.sdk = new UniversalLoginSDK(
      `https://${chain}.ul-relayer.linkdrop.io`,
      `https://${chain}.infura.io`
    )

    return this.sdk
  }
}

export default WalletSDK
