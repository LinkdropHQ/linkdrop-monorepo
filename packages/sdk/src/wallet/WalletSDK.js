import UniversalLoginSDK from '@universal-login/sdk'
import { LinkdropSDK } from '@linkdrop/sdk'
import { BalanceObserver } from '@universal-login/sdk/dist/lib/core/observers/BalanceObserver'
import { FutureWalletFactory } from '@universal-login/sdk/dist/lib/api/FutureWalletFactory'
import {
  calculateInitializeSignature,
  ensureNotNull
} from '@universal-login/commons'

import { getString } from '../../../scripts/src/utils'
const LINKDROP_FACTORY_ADDRESS = getString('FACTORY_ADDRESS')

class WalletSDK {
  constructor (chain = 'rinkeby') {
    if (chain !== 'mainnet' && chain !== 'rinkeby') {
      throw new Error('Chain not supported')
    }

    this.chain = chain
    this.jsonRpcUrl = `https://${chain}.infura.io`

    this.sdk = new UniversalLoginSDK(
      'http://rinkeby.linkdrop.io:1104',
      this.jsonRpcUrl
    )
  }

  async claim ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    receiverAddress,
    campaignId
  }) {
    //
    const linkdropSDK = LinkdropSDK({
      linkdropMasterAddress,
      chain: this.chain,
      jsonRpcUrl: this.jsonRpcUrl,
      apiHost: `https://${this.chain}.linkdrop.io`,
      factoryAddress: LINKDROP_FACTORY_ADDRESS
    })

    return linkdropSDK.claim({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropSignerSignature,
      receiverAddress,
      campaignId
    })
  }

  async _getFutureWalletFactory () {
    ensureNotNull(
      this.sdk.config,
      Error,
      'Relayer configuration not yet loaded'
    )

    const futureWalletConfig = {
      supportedTokens: this.sdk.config.supportedTokens,
      factoryAddress: this.sdk.config.factoryAddress,
      contractWhiteList: this.sdk.config.contractWhiteList,
      chainSpec: this.sdk.config.chainSpec
    }
    this.sdk.futureWalletFactory =
      this.sdk.futureWalletFactory ||
      new FutureWalletFactory(
        futureWalletConfig,
        this.sdk.provider,
        this.sdk.blockchainService,
        this.sdk.relayerApi
      )
  }

  async createFutureWallet () {
    await this.sdk.getRelayerConfig()
    await this._getFutureWalletFactory()

    const [
      privateKey,
      contractAddress,
      publicKey
    ] = await this.sdk.futureWalletFactory.blockchainService.createFutureWallet(
      this.sdk.futureWalletFactory.config.factoryAddress
    )

    const waitForBalance = async () =>
      new Promise(resolve => {
        const onReadyToDeploy = (tokenAddress, contractAddress) =>
          resolve({ tokenAddress, contractAddress })
        const balanceObserver = new BalanceObserver(
          this.sdk.futureWalletFactory.config.supportedTokens,
          this.sdk.futureWalletFactory.provider
        )
        balanceObserver.startAndSubscribe(contractAddress, onReadyToDeploy)
      })

    const deploy = async (ensName, gasPrice) => {
      const initData = await this.sdk.futureWalletFactory.setupInitData(
        publicKey,
        ensName,
        gasPrice
      )
      const signature = await calculateInitializeSignature(initData, privateKey)
      return this.sdk.futureWalletFactory.relayerApi.deploy(
        publicKey,
        ensName,
        gasPrice,
        signature
      )
    }

    return {
      privateKey,
      contractAddress,
      waitForBalance,
      deploy
    }
  }
}

export default WalletSDK
