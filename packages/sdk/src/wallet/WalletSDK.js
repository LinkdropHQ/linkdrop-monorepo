import { ethers } from 'ethers'
import { getEncodedData, getParamFromTxEvent } from './utils'
import { computeSafeAddress } from './computeSafeAddress'
import { createSafe } from './createSafe'
import { signTx } from './signTx'
import { executeTx } from './executeTx'

class WalletSDK {
  constructor (chain = 'rinkeby') {
    this.chain = chain
    this.jsonRpcUrl = `https://${chain}.infura.io`
    this.apiHost = 'http://localhost:5050'
  }

  /**
   * @dev Function to get encoded params data from contract
   * @param {Object} abi Contract abi
   * @param {String} method Function name
   * @param {Array<T>} params Array of function params to be encoded
   * @return Encoded params data
   */
  getEncodedData (abi, method, params) {
    return getEncodedData(abi, method, params)
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
   */
  async computeSafeAddress ({
    owner,
    saltNonce,
    gnosisSafeMasterCopy = '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A', // from https://safe-relay.gnosis.pm/api/v1/about/,
    proxyFactory = '0x12302fE9c02ff50939BaAaaf415fc226C078613C' // from https://safe-relay.gnosis.pm/api/v1/about/,
  }) {
    return computeSafeAddress({
      owner,
      saltNonce,
      gnosisSafeMasterCopy,
      proxyFactory,
      jsonRpcUrl: this.jsonRpcUrl
    })
  }

  /**
   * Function to create new safe
   * @param {String} owner Safe owner's address
   * @returns {Object} {success, txHash, safe, errors}
   */
  async createSafe (owner) {
    return createSafe({ apiHost: this.apiHost, owner })
  }

  /**
   * Function to execute safe transaction
   * @param {String} safe Safe address
   * @param {String} privateKey Safe owner's private key
   * @param {String} to To
   * @param {Number} value Value
   * @param {String} data Data
   * @param {Number} operation Operation
   * @param {Number} safeTxGas Safe tx gas
   * @param {Number} baseGas Base gas
   * @param {Number} gasPrice Gas price
   * @param {String} gasToken Gas token
   * @param {String} refundReceiver Refund receiver
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
    refundReceiver = '0x0000000000000000000000000000000000000000'
  }) {
    return executeTx({
      apiHost: this.apiHost,
      jsonRpcUrl: this.jsonRpcUrl,
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
   * @param {String} data Data
   * @param {Number} operation Operation
   * @param {Number} safeTxGas Safe tx gas
   * @param {Number} baseGas Base gas
   * @param {Number} gasPrice Gas price
   * @param {String} gasToken Gas token
   * @param {String} refundReceiver Refund receiver
   * @param {Number} nonce Safe's nonce
   * @returns {String} Signature
   */
  signTx ({
    safe,
    privateKey,
    to,
    value,
    data = '0x',
    nonce = 0,
    operation = 0,
    safeTxGas = 0,
    baseGas = 0,
    gasPrice = 0,
    gasToken = '0x0000000000000000000000000000000000000000',
    refundReceiver = '0x0000000000000000000000000000000000000000'
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
}

export default WalletSDK
