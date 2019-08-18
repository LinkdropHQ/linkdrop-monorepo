import { BalanceObserver } from '@universal-login/sdk/dist/lib/core/observers/BalanceObserver'
import { FutureWalletFactory } from '@universal-login/sdk/dist/lib/api/FutureWalletFactory'
import {
  calculateInitializeSignature,
  ensureNotNull
} from '@universal-login/commons'
import path from 'path'
import csvToJson from 'csvtojson'
import queryString from 'query-string'

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

export const getUrlParams = async (type, i) => {
  const csvFilePath = path.resolve(__dirname, `../output/linkdrop_${type}.csv`)
  const jsonArray = await csvToJson().fromFile(csvFilePath)
  const rawUrl = jsonArray[i].url.replace('#', '')
  const parsedUrl = await queryString.extract(rawUrl)
  const parsed = await queryString.parse(parsedUrl)
  return parsed
}
