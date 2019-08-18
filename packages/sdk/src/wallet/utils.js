import { BalanceObserver } from '@universal-login/sdk/dist/lib/core/observers/BalanceObserver'
import { FutureWalletFactory } from '@universal-login/sdk/dist/lib/api/FutureWalletFactory'
import {
  calculateInitializeSignature,
  ensureNotNull
} from '@universal-login/commons'

export const _getFutureWalletFactory = async () => {
  ensureNotNull(this.sdk.config, Error, 'Relayer configuration not yet loaded')

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
