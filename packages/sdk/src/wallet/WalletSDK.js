import { ethers } from 'ethers'
import {
  encodeParams,
  encodeDataForMultiSend,
  getParamFromTxEvent
} from './utils'
import { computeSafeAddress } from './computeSafeAddress'
import { create, createWithENS } from './createSafe'
import { signTx } from './signTx'
import { executeTx } from './executeTx'
import { getEnsOwner } from './ensUtils'

class WalletSDK {
  constructor (chain = 'rinkeby') {
    this.chain = chain
    this.jsonRpcUrl = `https://${chain}.infura.io`
    this.apiHost = 'http://localhost:5050'
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
   * @param {String} owner Safe owner address
   * @param {String | Number} saltNonce Random salt nonce
   * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
   * @param {String} proxyFactory Deployed proxy factory address
   * @param {String} jsonRpcUrl JSON RPC URL (optional)
   */
  async computeSafeAddress ({
    owner,
    saltNonce,
    gnosisSafeMasterCopy = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A', // from https://safe-relay.gnosis.pm/api/v1/about/
    proxyFactory = '0x12302fE9c02ff50939BaAaaf415fc226C078613C', // from https://safe-relay.gnosis.pm/api/v1/about/
    jsonRpcUrl = this.jsonRpcUrl
  }) {
    return computeSafeAddress({
      owner,
      saltNonce,
      gnosisSafeMasterCopy,
      proxyFactory,
      jsonRpcUrl
    })
  }

  /**
   * Function to create new safe
   * @param {String} owner Safe owner's address
   * @param {String} apiHost API host (optional)
   * @returns {Object} {success, txHash, safe, errors}
   */
  async create ({ owner, apiHost = this.apiHost }) {
    return create({ owner, apiHost })
  }

  /**
   * Function to create new safe
   * @param {String} owner Safe owner's address
   * @param {String} name ENS name to register for safe
   * @param {String} apiHost API host (optional)
   * @returns {Object} {success, txHash, safe, errors}
   */
  async createWithENS ({ owner, name, apiHost = this.apiHost }) {
    return createWithENS({ owner, name, apiHost })
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
    safeTxGas = 0,
    baseGas = 0,
    gasPrice = 0,
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
      safeTxGas,
      baseGas,
      gasPrice,
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
}

export default WalletSDK
