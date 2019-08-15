import UniversalLoginSDK from '@universal-login/sdk'
import { LinkdropSDK } from '@linkdrop/sdk'
import { DeploymentReadyObserver } from '@universal-login/sdk/dist/lib/core/observers/DeploymentReadyObserver'
import { FutureWalletFactory } from '@universal-login/sdk/dist/lib/api/FutureWalletFactory'
import {
  calculateInitializeSignature,
  ensureNotNull,
  DEFAULT_GAS_PRICE,
  computeContractAddress
} from '@universal-login/commons'

import { ethers } from 'ethers'

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
      'http://rinkeby.linkdrop.io:11004',
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

  async _fetchFutureWalletFactory () {
    await this.sdk.getRelayerConfig()
    ensureNotNull(
      this.sdk.relayerConfig,
      Error,
      'Relayer configuration not yet loaded'
    )

    const futureWalletConfig = {
      supportedTokens: this.sdk.relayerConfig.supportedTokens,
      factoryAddress: this.sdk.relayerConfig.factoryAddress,
      contractWhiteList: this.sdk.relayerConfig.contractWhiteList,
      chainSpec: this.sdk.relayerConfig.chainSpec
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

  async computeProxyAddress (publicKey) {
    await this._fetchFutureWalletFactory()
    const factoryAddress = this.sdk.futureWalletFactory.config.factoryAddress
    const initCode = await this.sdk.futureWalletFactory.blockchainService.getInitCode(
      factoryAddress
    )
    return computeContractAddress(factoryAddress, publicKey, initCode)
  }

  async createFutureWallet () {
    await this._fetchFutureWalletFactory()
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
        const deploymentReadyObserver = new DeploymentReadyObserver(
          this.sdk.futureWalletFactory.config.supportedTokens,
          this.sdk.futureWalletFactory.provider
        )
        deploymentReadyObserver.startAndSubscribe(
          contractAddress,
          onReadyToDeploy
        )
      })

    const deploy = async (ensName, gasPrice = DEFAULT_GAS_PRICE) => {
      try {
        const initData = await this.sdk.futureWalletFactory.setupInitData(
          publicKey,
          ensName,
          gasPrice
        )
        const signature = await calculateInitializeSignature(
          initData,
          privateKey
        )
        const tx = await this.sdk.futureWalletFactory.relayerApi.deploy(
          publicKey,
          ensName,
          gasPrice,
          signature
        )

        return { success: true, txHash: tx.hash }
      } catch (err) {
        return { errors: err }
      }
    }

    return {
      privateKey,
      contractAddress,
      publicKey,
      waitForBalance,
      deploy
    }
  }

  async deploy (privateKey, ensName, gasPrice = DEFAULT_GAS_PRICE) {
    try {
      await this._fetchFutureWalletFactory()
      const publicKey = new ethers.Wallet(privateKey).address

      const initData = await this.sdk.futureWalletFactory.setupInitData(
        publicKey,
        ensName,
        gasPrice
      )
      const signature = await calculateInitializeSignature(initData, privateKey)

      const tx = await this.sdk.futureWalletFactory.relayerApi.deploy(
        publicKey,
        ensName,
        gasPrice,
        signature
      )

      return { success: true, txHash: tx.hash }
    } catch (err) {
      return { errors: err }
    }
  }

  async claimAndDeploy (claimParams, deployParams) {
    const {
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId
    } = claimParams

    const {
      privateKey,
      contractAddress,
      waitForBalance,
      deploy
    } = await this.createFutureWallet()

    await waitForBalance()

    await this.claim({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: contractAddress,
      campaignId
    })

    const { txHash } = await deploy(deployParams)

    return { privateKey, contractAddress, deployTxHash: txHash }
  }

  async execute (message, privateKey) {
    try {
      const { messageStatus } = await this.sdk.execute(message, privateKey)
      return { success: true, txHash: messageStatus.transactionHash }
    } catch (err) {
      return { errors: err }
    }
  }

  async walletContractExist (ensName) {
    return this.sdk.walletContractExist(ensName)
  }
}

export default WalletSDK

const main = async () => {
  const gasPrice = ethers.utils.parseUnits('5', 'gwei').toString()

  const sdk = new WalletSDK()

  const pub = new ethers.Wallet(
    '0x0a24c99c3c585048032b67fea393e808db20137f7fc49d8301c849793ef75eb9'
  ).address

  const addr = await sdk.computeProxyAddress(pub)
  console.log('addr: ', addr)

  // const {
  //   privateKey,
  //   contractAddress,
  //   waitForBalance,
  //   deploy
  // } = await sdk.createFutureWallet()

  // console.log({ privateKey, contractAddress })

  // await waitForBalance()

  // const tx = await deploy('amir1.linkdrop.test', gasPrice)

  // const tx = await sdk.deploy(
  //   '0x0a24c99c3c585048032b67fea393e808db20137f7fc49d8301c849793ef75eb9',
  //   'amir3.linkdrop.test',
  //   gasPrice
  // )

  // console.log('tx: ', tx)

  // const exists = await sdk.walletContractExist('amir3.linkdrop.test')
  // console.log('exists: ', exists)
}
main()
