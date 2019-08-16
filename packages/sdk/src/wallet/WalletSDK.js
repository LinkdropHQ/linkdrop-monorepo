import UniversalLoginSDK from '@universal-login/sdk'
import { LinkdropSDK } from '@linkdrop/sdk'
import { DeploymentReadyObserver } from '@universal-login/sdk/dist/lib/core/observers/DeploymentReadyObserver'
import { FutureWalletFactory } from '@universal-login/sdk/dist/lib/api/FutureWalletFactory'
import WalletMasterWithRefund from '@linkdrop/contracts/metadata/WalletMasterWithRefund'
import {
  calculateInitializeSignature,
  ensureNotNull,
  DEFAULT_GAS_PRICE,
  computeContractAddress
} from '@universal-login/commons'

import LinkdropFactory from '../../../contracts/build/LinkdropFactory.json'
import { ethers } from 'ethers'
import { claimAndDeploy } from './claimAndDeploy'

import { getUrlParams } from '../../../scripts/src/utils'

import { signReceiverAddress } from '../utils'

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

  async getDeployData ({ privateKey, ensName, gasPrice = DEFAULT_GAS_PRICE }) {
    await this._fetchFutureWalletFactory()
    const publicKey = new ethers.Wallet(privateKey).address

    const initData = await this.sdk.futureWalletFactory.setupInitData(
      publicKey,
      ensName,
      gasPrice
    )
    const signature = await calculateInitializeSignature(initData, privateKey)

    return { initData, signature }
  }

  async getCreateWalletData ({ publicKey, initializeWithENSData, signature }) {
    return new ethers.Interface(
      WalletMasterWithRefund.abi
    ).functions.createWallet.encode([
      publicKey,
      initializeWithENSData,
      signature
    ])
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
      factoryAddress = '0x6e89FB04c1F39E6bE0a08d47E0b96593EC192411'
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
      apiHost: `http://localhost:5000`,
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

const main = async () => {
  const walletSDK = new WalletSDK()

  // const { privateKey, contractAddress } = await walletSDK.createFutureWallet()
  // console.log('contractAddress: ', contractAddress)
  // console.log('privateKey: ', privateKey)

  const contractAddress = '0x496a61f284ced6a5a064d59e16c172e2dc8461fe'
  const privateKey =
    '0x17ee1784c913068968b1e2a46277bc8d6f219fe557ab6aa645b5f7b53b2c1ee6'
  const publicKey = new ethers.Wallet(privateKey).address

  const {
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    campaignId
  } = await getUrlParams('eth', 1)

  const linkId = new ethers.Wallet(linkKey).address

  const receiverSignature = await signReceiverAddress(linkKey, contractAddress)

  const claimData = await new ethers.utils.Interface(
    LinkdropFactory.abi
  ).functions.claim.encode([
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId,
    linkdropMasterAddress,
    campaignId,
    linkdropSignerSignature,
    contractAddress,
    receiverSignature
  ])

  console.log('claimData: ', claimData)

  const { initData, signature } = await walletSDK.getDeployData(
    privateKey,
    'spb.linkdrop.test'
  )

  // const { error, errors, success, txHash } = await walletSDK.claimAndDeploy(
  //   {
  //     weiAmount,
  //     tokenAddress,
  //     tokenAmount,
  //     expirationTime,
  //     linkKey,
  //     linkdropMasterAddress,
  //     linkdropSignerSignature,
  //     campaignId
  //   },
  //   {
  //     privateKey,
  //     ensName: 'amir01.linkdrop.test'
  //   }
  // )

  // console.log({ error, errors, success, txHash })

  const walletFactory = '0x6D164F68cf94317e870223347E50859b70c61594'

  const provider = new ethers.providers.JsonRpcProvider(
    'https://rinkeby.infura.io'
  )
  const relayerPrivKey =
    'CA90DCD89716EE6FFCCE036B6AE6BCEE5C40AFA1D6373DF99FB59C9780CBFE2A'
  const relayer = new ethers.Wallet(relayerPrivKey, provider)

  const linkdropFactory = new ethers.Contract(
    '0x97dbfFFEAC890600759836D411DBa68159e8bf43',
    LinkdropFactory.abi,
    relayer
  )
  const tx = await linkdropFactory.claimAndDeploy(
    claimData,
    walletFactory,
    publicKey,
    initData,
    signature
  )
  console.log('tx: ', tx)
}

main()
