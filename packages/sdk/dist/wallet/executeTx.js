"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeTx = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _ethers = require("ethers");

var _signTx = require("./signTx");

var _GnosisSafe = _interopRequireDefault(require("@gnosis.pm/safe-contracts/build/contracts/GnosisSafe"));

/**
 * Function to execute safe transaction
 * @param {String} apiHost API host
 * @param {String} jsonRpcUrl JSON RPC URL
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
var executeTx =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var apiHost, jsonRpcUrl, safe, privateKey, to, value, data, operation, safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, provider, gnosisSafe, nonce, signature, response, _response$data, success, txHash, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            apiHost = _ref.apiHost, jsonRpcUrl = _ref.jsonRpcUrl, safe = _ref.safe, privateKey = _ref.privateKey, to = _ref.to, value = _ref.value, data = _ref.data, operation = _ref.operation, safeTxGas = _ref.safeTxGas, baseGas = _ref.baseGas, gasPrice = _ref.gasPrice, gasToken = _ref.gasToken, refundReceiver = _ref.refundReceiver;

            _assertJs["default"].url(apiHost, 'Api host is required');

            _assertJs["default"].url(jsonRpcUrl, 'Json rpc url is required');

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

            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
            gnosisSafe = new _ethers.ethers.Contract(safe, _GnosisSafe["default"].abi, provider);
            _context.next = 17;
            return gnosisSafe.nonce();

          case 17:
            nonce = _context.sent;
            signature = (0, _signTx.signTx)({
              safe: safe,
              privateKey: privateKey,
              to: to,
              value: value,
              data: data,
              operation: operation,
              safeTxGas: safeTxGas,
              baseGas: baseGas,
              gasPrice: gasPrice,
              gasToken: gasToken,
              refundReceiver: refundReceiver,
              nonce: nonce.toNumber()
            });
            _context.next = 21;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes/execute"), {
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
              signature: signature
            });

          case 21:
            response = _context.sent;
            _response$data = response.data, success = _response$data.success, txHash = _response$data.txHash, errors = _response$data.errors;
            return _context.abrupt("return", {
              success: success,
              txHash: txHash,
              errors: errors
            });

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function executeTx(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.executeTx = executeTx;