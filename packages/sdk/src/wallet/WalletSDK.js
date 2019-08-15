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
import { claimAndDeploy } from './claimAndDeploy'

class WalletSDK {
  //
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
    campaignId,
    factoryAddress
  }) {
    //
    const linkdropSDK = new LinkdropSDK({
      linkdropMasterAddress,
      chain: this.chain,
      jsonRpcUrl: this.jsonRpcUrl,
      apiHost: `https://${this.chain}.linkdrop.io`,
      factoryAddress
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

  async claimAndDeploy (
    {
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId,
      factoryAddress = '0xBa051891B752ecE3670671812486fe8dd34CC1c8'
    },
    {
      privateKey,
      ensName,
      gasPrice = ethers.utils.parseUnits('5', 'gwei').toString()
    }
  ) {
    const linkdropSDK = new LinkdropSDK({
      linkdropMasterAddress,
      chain: this.chain,
      jsonRpcUrl: this.jsonRpcUrl,
      apiHost: `https://${this.chain}.linkdrop.io`,
      factoryAddress
    })

    await this._fetchFutureWalletFactory()
    const publicKey = new ethers.Wallet(privateKey).address

    const contractAddress = await this.computeProxyAddress(publicKey)

    const initData = await this.sdk.futureWalletFactory.setupInitData(
      publicKey,
      ensName,
      gasPrice
    )
    const signature = await calculateInitializeSignature(initData, privateKey)

    return claimAndDeploy({
      jsonRpcUrl: linkdropSDK.jsonRpcUrl,
      apiHost: linkdropSDK.apiHost,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version:
        linkdropSDK.version[campaignId] ||
        (await linkdropSDK.getVersion(campaignId)),
      chainId: linkdropSDK.chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId,
      receiverAddress: contractAddress,
      factoryAddress,
      walletFactory: this.sdk.futureWalletFactory.config.factoryAddress,
      publicKey,
      initializeWithENS: initData,
      signature
    })
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
