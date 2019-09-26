import { ethers } from 'ethers'
import {
  encodeParams,
  encodeDataForMultiSend,
  getParamFromTxEvent,
  encodeDataForCreateAndAddModules
} from './utils'
import { computeSafeAddress } from './computeSafeAddress'
import { computeLinkdropModuleAddress } from './computeLinkdropModuleAddress'
import { create, claimAndCreate } from './createSafe'
import { signTx } from './signTx'
import { executeTx } from './executeTx'
import { getEnsOwner } from './ensUtils'
import { generateLink, generateLinkERC721 } from './generateLink'
import { claim, claimERC721 } from './claim'

const ADDRESS_ZERO = ethers.constants.AddressZero
const BYTES_ZERO = '0x'

class WalletSDK {
  constructor ({
    chain = 'rinkeby',
    apiHost = 'http://localhost:5050',
    claimHost = 'https://claim.linkdrop.io',
    jsonRpcUrl,
    gnosisSafeMasterCopy = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A', // from https://safe-relay.gnosis.pm/api/v1/about/
    proxyFactory = '0x12302fE9c02ff50939BaAaaf415fc226C078613C', // from https://safe-relay.gnosis.pm/api/v1/about/
    linkdropModuleMasterCopy = '0x19Ff4Cb4eFD0b9E04433Dde6507ADC68225757f2',
    createAndAddModules = '0x40Ba7DF971BBdE476517B7d6B908113f71583183', // from https://safe-relay.gnosis.pm/api/v1/about/
    multiSend = '0x0CE1BBc1BbbF65C3953A3f1f80344b42C084FA0c'
  }) {
    this.chain = chain
    this.jsonRpcUrl = jsonRpcUrl || `https://${chain}.infura.io`
    this.apiHost = apiHost
    this.claimHost = claimHost
    this.gnosisSafeMasterCopy = gnosisSafeMasterCopy
    this.proxyFactory = proxyFactory
    this.linkdropModuleMasterCopy = linkdropModuleMasterCopy
    this.createAndAddModules = createAndAddModules
    this.multiSend = multiSend
  }

  /**
   * @dev Function to get encoded params data from contract abi
   * @param {Object} abi Contract abi
   * @param {String} method Function name
   * @param {Array<T>} params Array of function params to be encoded
   * @return Encoded params data
   */
  encodeParams (abi, method, params) {
    return encodeParams(abi, method, params)
  }

  encodeDataForMultiSend (operation, to, value, data) {
    return encodeDataForMultiSend(operation, to, value, data)
  }

  /**
   * Function to get specific param from transaction event
   * @param {Object} tx Transaction object compatible with ethers.js library
   * @param {String} eventName Event name to parse param from
   * @param {String} paramName Parameter to be retrieved from event log
   * @param {Object} contract Contract instance compatible with ethers.js library
   * @return {String} Parameter parsed from transaction event
   */
  async getParamFromTxEvent (tx, eventName, paramName, contract) {
    return getParamFromTxEvent(tx, eventName, paramName, contract)
  }

  /**
   * Function to calculate the safe address based on given params
   * @param {String | Number} saltNonce Random salt nonce
   * @param {String} deployer Deployer address (optional)
   * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address (optional)
   * @param {String} owner Safe owner address
   * @param {String} to To (optional)
   * @param {String} data Data (optional)
   */
  computeSafeAddress ({
    saltNonce,
    deployer = this.proxyFactory,
    gnosisSafeMasterCopy = this.gnosisSafeMasterCopy,
    owner,
    to = ADDRESS_ZERO,
    data = BYTES_ZERO
  }) {
    return computeSafeAddress({
      owner,
      saltNonce,
      gnosisSafeMasterCopy,
      deployer,
      to,
      data
    })
  }

  /**
   * Function to create new safe
   * @param {String} owner Safe owner's address
   * @param {String} name ENS name to register for safe
   * @param {String} apiHost API host (optional)
   * @returns {Object} {success, txHash, safe, errors}
   */
  async create ({ owner, name, apiHost = this.apiHost }) {
    return create({ owner, name, apiHost })
  }

  /**
   * Function to execute safe transaction
   * @param {String} safe Safe address
   * @param {String} privateKey Safe owner's private key
   * @param {String} to To
   * @param {Number} value Value
   * @param {String} data Data (optional)
   * @param {Number} operation Operation (optional)
   * @param {Number} safeTxGas Safe tx gas (optional)
   * @param {Number} baseGas Base gas (optional)
   * @param {Number} gasPrice Gas price (optional)
   * @param {String} gasToken Gas token (optional)
   * @param {String} refundReceiver Refund receiver (optional)
   * @param {String} apiHost API host (optional)
   * @param {String} jsonRpcUrl JSON RPC URL (optional)
   * @returns {Object} {success, txHash, errors}
   */
  async executeTx ({
    safe,
    privateKey,
    to,
    value,
    data = '0x',
    operation = 0,
    gasToken = '0x0000000000000000000000000000000000000000',
    refundReceiver = '0x0000000000000000000000000000000000000000',
    apiHost = this.apiHost,
    jsonRpcUrl = this.jsonRpcUrl
  }) {
    return executeTx({
      apiHost,
      jsonRpcUrl,
      safe,
      privateKey,
      to,
      value,
      data,
      operation,
      gasToken,
      refundReceiver
    })
  }

  /**
   * Function to sign safe transaction
   * @param {String} safe Safe address
   * @param {String} privateKey Safe owner's private key
   * @param {String} to To
   * @param {Number} value Value
   * @param {String} data Data (optional)
   * @param {Number} operation Operation (optional)
   * @param {Number} safeTxGas Safe tx gas (optional)
   * @param {Number} baseGas Base gas (optional)
   * @param {Number} gasPrice Gas price (optional)
   * @param {String} gasToken Gas token (optional)
   * @param {String} refundReceiver Refund receiver (optional)
   * @param {Number} nonce Safe's nonce
   * @returns {String} Signature
   */
  signTx ({
    safe,
    privateKey,
    to,
    value,
    data = '0x',
    operation = 0,
    safeTxGas = 0,
    baseGas = 0,
    gasPrice = 0,
    gasToken = '0x0000000000000000000000000000000000000000',
    refundReceiver = '0x0000000000000000000000000000000000000000',
    nonce
  }) {
    return signTx({
      safe,
      privateKey,
      to,
      value,
      data,
      operation,
      safeTxGas,
      baseGas,
      gasPrice,
      gasToken,
      refundReceiver,
      nonce
    })
  }

  /**
   * Function to get owner of ENS identifier
   * @param {String} name ENS identifier (e.g 'alice.eth')
   * @param {String} chain Chain identifier (optional)
   * @param {String} jsonRpcUrl JSON RPC URL (optional)
   * @return {String} ENS identifier owner's address
   */
  async getEnsOwner ({
    name,
    chain = this.chain,
    jsonRpcUrl = this.jsonRpcUrl
  }) {
    return getEnsOwner({ name, chain, jsonRpcUrl })
  }

  /**
   *
   * @param {String} weiAmount Wei amount
   * @param {String} tokenAddress Token address
   * @param {String} tokenAmount Token amount
   * @param {String} expirationTime Link expiration timestamp
   * @param {String} linkKey Ephemeral key assigned to link
   * @param {String} linkdropMasterAddress Linkdrop master address
   * @param {String} linkdropSignerSignature Linkdrop signer signature
   * @param {String} campaignId Campaign id
   * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address (optional)
   * @param {String} proxyFactory Deployed proxy factory address (optional)
   * @param {String} owner Safe owner address
   * @param {String} name ENS name to register for safe
   * @param {String} linkdropModuleMasterCopy Deployed linkdrop module master copy address (optional)
   * @param {String} createAndAddModules Deployed createAndAddModules library address (optional)
   * @param {String} multiSend Deployed multiSend library address (optional)
   * @param {String} apiHost API host (optional)
   * @returns {Object} {success, txHash, safe, errors}
   */
  async claimAndCreate ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropMasterAddress,
    linkdropSignerSignature,
    campaignId,
    gnosisSafeMasterCopy = this.gnosisSafeMasterCopy,
    owner,
    name,
    proxyFactory = this.proxyFactory,
    linkdropModuleMasterCopy = this.linkdropModuleMasterCopy,
    createAndAddModules = this.createAndAddModules,
    multiSend = this.multiSend,
    apiHost = this.apiHost
  }) {
    return claimAndCreate({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId,
      gnosisSafeMasterCopy,
      proxyFactory,
      owner,
      name,
      linkdropModuleMasterCopy,
      createAndAddModules,
      multiSend,
      apiHost
    })
  }

  /**
   * Function to calculate the linkdrop module address based on given params
   * @param {String} owner Safe owner address
   * @param {String | Number} saltNonce Random salt nonce
   * @param {String} linkdropModuleMasterCopy Deployed linkdrop module mastercopy address
   * @param {String} deployer Deployer address
   */
  computeLinkdropModuleAddress ({
    owner,
    saltNonce,
    linkdropModuleMasterCopy = this.linkdropModuleMasterCopy,
    deployer = this.proxyFactory
  }) {
    return computeLinkdropModuleAddress({
      owner,
      saltNonce,
      linkdropModuleMasterCopy,
      deployer
    })
  }

  /**
   * Function to get encoded data to use in CreateAndAddModules library
   * @param {String} dataArray Data array concatenated
   */
  encodeDataForCreateAndAddModules (dataArray) {
    return encodeDataForCreateAndAddModules(dataArray)
  }

  /**
   * @description Function to generate link for ETH and/or ERC20
   * @param {String | Object} signingKeyOrWallet Signing key or wallet instances
   * @param {String} linkdropModuleAddress Address of linkdrop module
   * @param {String} weiAmount Wei amount
   * @param {String} tokenAddress Token address
   * @param {Number} tokenAmount Amount of tokens
   * @param {Number} expirationTime Link expiration timestamp
   */
  async generateLink ({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime
  }) {
    return generateLink({
      claimHost: this.claimHost,
      linkdropModuleAddress,
      signingKeyOrWallet,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime
    })
  }

  /**
   * @description Function to generate link for ETH and/or ERC721
   * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
   * @param {String} linkdropModuleAddress Address of linkdrop module
   * @param {String} weiAmount Wei amount
   * @param {String} nftAddress NFT address
   * @param {Number} tokenId Token id
   * @param {Number} expirationTime Link expiration timestamp
   */
  async generateLinkERC721 ({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime
  }) {
    return generateLinkERC721({
      claimHost: this.claimHost,
      signingKeyOrWallet,
      linkdropModuleAddress,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime
    })
  }

  /**
   * @description Function to claim ETH and/or ERC20 tokens
   * @param {String} weiAmount Wei amount
   * @param {String} tokenAddress Token address
   * @param {Number} tokenAmount Amount of tokens
   * @param {Number} expirationTime Link expiration timestamp
   * @param {String} linkKey Ephemeral key attached to link
   * @param {String} linkdropModuleAddress Address of linkdrop module
   * @param {String} linkdropSignerSignature Linkdrop signer signature
   * @param {String} receiverAddress Receiver address
   */
  async claim ({
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress
  }) {
    return claim({
      apiHost: this.apiHost,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress
    })
  }

  /**
   * @description Function to claim ETH and/or ERC721 tokens
   * @param {String} weiAmount Wei amount
   * @param {String} nftAddress NFT address
   * @param {Number} tokenId Token id
   * @param {Number} expirationTime Link expiration timestamp
   * @param {String} linkKey Ephemeral key attached to link
   * @param {String} linkdropModuleAddress Address of linkdrop module
   * @param {String} linkdropSignerSignature Linkdrop signer signature
   * @param {String} receiverAddress Receiver address
   */
  async claimERC721 ({
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkKey,
    linkdropModuleAddress,
    linkdropSignerSignature,
    receiverAddress
  }) {
    return claimERC721({
      apiHost: this.apiHost,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkKey,
      linkdropModuleAddress,
      linkdropSignerSignature,
      receiverAddress
    })
  }
}

export default WalletSDK
