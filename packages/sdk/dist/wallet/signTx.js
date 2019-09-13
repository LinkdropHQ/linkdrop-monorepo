"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signTx = void 0;

var _ethSigUtil = _interopRequireDefault(require("eth-sig-util"));

var _buffer = require("buffer");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _ethers = require("ethers");

var _GnosisSafe = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe"));

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
 */
var signTx = function signTx(_ref) {
  var safe = _ref.safe,
      privateKey = _ref.privateKey,
      to = _ref.to,
      value = _ref.value,
      data = _ref.data,
      operation = _ref.operation,
      safeTxGas = _ref.safeTxGas,
      baseGas = _ref.baseGas,
      gasPrice = _ref.gasPrice,
      gasToken = _ref.gasToken,
      refundReceiver = _ref.refundReceiver,
      nonce = _ref.nonce;

  _assertJs["default"].string(safe, 'Safe address is required');

  _assertJs["default"].string(privateKey, 'Private key is required');

  _assertJs["default"].string(to, 'To is required');

  _assertJs["default"].integer(value, 'Value is required');

  _assertJs["default"].string(data, 'Data is required');

  _assertJs["default"].integer(safeTxGas, 'Safe tx gas is required');

  _assertJs["default"].integer(baseGas, 'Base gas is required');

  _assertJs["default"].integer(gasPrice, 'Gas price is required');

  _assertJs["default"].string(gasToken, 'Gas token is required');

  _assertJs["default"].string(refundReceiver, 'Refund receiver address is required');

  _assertJs["default"].integer(nonce, 'Nonce is required');

  if (privateKey.includes('0x')) {
    privateKey = privateKey.replace('0x', '');
  }

  privateKey = _buffer.Buffer.from(privateKey, 'hex');
  var typedData = getTypedData({
    safe: safe,
    to: to,
    value: value,
    data: data,
    operation: operation,
    safeTxGas: safeTxGas,
    baseGas: baseGas,
    gasPrice: gasPrice,
    gasToken: gasToken,
    refundReceiver: refundReceiver,
    nonce: nonce
  });
  /**
    r: new BigNumber(signature.slice(2, 66), 16).toString(10),
    s: new BigNumber(signature.slice(66, 130), 16).toString(10),
    v: new BigNumber(signature.slice(130, 132), 16).toString(10)
   */

  return _ethSigUtil["default"].signTypedData(privateKey, {
    data: typedData
  });
};

exports.signTx = signTx;

var getTypedData = function getTypedData(_ref2) {
  var safe = _ref2.safe,
      to = _ref2.to,
      value = _ref2.value,
      data = _ref2.data,
      operation = _ref2.operation,
      safeTxGas = _ref2.safeTxGas,
      baseGas = _ref2.baseGas,
      gasPrice = _ref2.gasPrice,
      gasToken = _ref2.gasToken,
      refundReceiver = _ref2.refundReceiver,
      nonce = _ref2.nonce;
  return {
    types: {
      EIP712Domain: [{
        type: 'address',
        name: 'verifyingContract'
      }],
      SafeTx: [{
        type: 'address',
        name: 'to'
      }, {
        type: 'uint256',
        name: 'value'
      }, {
        type: 'bytes',
        name: 'data'
      }, {
        type: 'uint8',
        name: 'operation'
      }, {
        type: 'uint256',
        name: 'safeTxGas'
      }, {
        type: 'uint256',
        name: 'baseGas'
      }, {
        type: 'uint256',
        name: 'gasPrice'
      }, {
        type: 'address',
        name: 'gasToken'
      }, {
        type: 'address',
        name: 'refundReceiver'
      }, {
        type: 'uint256',
        name: 'nonce'
      }]
    },
    domain: {
      verifyingContract: safe
    },
    primaryType: 'SafeTx',
    message: {
      to: to,
      value: value,
      data: data,
      operation: operation,
      safeTxGas: safeTxGas,
      baseGas: baseGas,
      gasPrice: gasPrice,
      gasToken: gasToken,
      refundReceiver: refundReceiver,
      nonce: nonce
    }
  };
};