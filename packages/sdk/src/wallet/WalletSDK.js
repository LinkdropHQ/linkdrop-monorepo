import { ethers } from 'ethers'
import { getEncodedData, getParamFromTxEvent } from './utils'
import { computeSafeAddress } from './computeSafeAddress'

class WalletSDK {
  constructor (chain = 'rinkeby') {
    this.chain = chain
    this.jsonRpcUrl = `https://${chain}.infura.io`
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
}

export default WalletSDK
