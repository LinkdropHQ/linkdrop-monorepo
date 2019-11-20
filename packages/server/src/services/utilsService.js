import { ethers } from 'ethers'

class UtilsService {
  /**
   * @dev Function to get encoded params data from contract abi
   * @param {Object} abi Contract abi
   * @param {String} method Function name
   * @param {Array<T>} params Array of function params to be encoded
   * @return Encoded params data
   */
  encodeParams (abi, method, params) {
    return new ethers.utils.Interface(abi).functions[method].encode([...params])
  }

  /**
   * Function to get encoded data to use in MultiSend library
   * @param {String} operation
   * @param {String} to
   * @param {String} value
   * @param {String} data
   */
  encodeDataForMultiSend (operation, to, value, data) {
    const transactionWrapper = new ethers.utils.Interface([
      'function send(uint8 operation, address to, uint256 value, bytes data)'
    ])
    return transactionWrapper.functions.send
      .encode([operation, to, value, data])
      .substr(10)
  }
}

export default new UtilsService()
