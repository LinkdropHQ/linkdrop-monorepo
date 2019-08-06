"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeTx = exports.estimateTx = exports.getDeploymentTxHash = exports.notifyService = exports.triggerSafeDeployment = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _signTx = require("./signTx");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var triggerSafeDeployment =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var owners,
        threshold,
        saltNonce,
        baseURL,
        _args = arguments;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            owners = _ref.owners, threshold = _ref.threshold, saltNonce = _ref.saltNonce;
            baseURL = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'https://safe-relay.rinkeby.gnosis.pm/api';

            if (owners) {
              _context.next = 4;
              break;
            }

            throw new Error('Owners is required');

          case 4:
            if (threshold) {
              _context.next = 6;
              break;
            }

            throw new Error('Threshold is required');

          case 6:
            if (saltNonce) {
              _context.next = 8;
              break;
            }

            throw new Error('Salt nonce is required');

          case 8:
            return _context.abrupt("return", (0, _axios["default"])({
              url: '/v2/safes/',
              method: 'post',
              data: {
                owners: owners,
                threshold: threshold,
                saltNonce: saltNonce
              },
              baseURL: baseURL
            }));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function triggerSafeDeployment(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.triggerSafeDeployment = triggerSafeDeployment;

var notifyService =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(safe) {
    var baseURL,
        _args2 = arguments;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            baseURL = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 'https://safe-relay.rinkeby.gnosis.pm/api';

            if (safe) {
              _context2.next = 3;
              break;
            }

            throw new Error('Safe address is required');

          case 3:
            return _context2.abrupt("return", (0, _axios["default"])({
              url: "/v2/safes/".concat(safe, "/funded"),
              method: 'put',
              baseURL: baseURL
            }));

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function notifyService(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.notifyService = notifyService;

var getDeploymentTxHash =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(safe) {
    var baseURL,
        response,
        _args3 = arguments;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            baseURL = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : 'https://safe-relay.rinkeby.gnosis.pm/api';

            if (safe) {
              _context3.next = 3;
              break;
            }

            throw new Error('Safe address is required');

          case 3:
            _context3.next = 5;
            return (0, _axios["default"])({
              url: "/v2/safes/".concat(safe, "/funded"),
              method: 'get',
              baseURL: baseURL
            });

          case 5:
            response = _context3.sent;
            return _context3.abrupt("return", response.data.txHash);

          case 7:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getDeploymentTxHash(_x3) {
    return _ref4.apply(this, arguments);
  };
}();

exports.getDeploymentTxHash = getDeploymentTxHash;

var estimateTx =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(_ref5) {
    var safe, to, value, _ref5$data, data, _ref5$operation, operation, _ref5$gasToken, gasToken, _ref5$baseURL, baseURL, response, _response$data, safeTxGas, baseGas, gasPrice, lastUsedNonce;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            safe = _ref5.safe, to = _ref5.to, value = _ref5.value, _ref5$data = _ref5.data, data = _ref5$data === void 0 ? '0x' : _ref5$data, _ref5$operation = _ref5.operation, operation = _ref5$operation === void 0 ? '0' : _ref5$operation, _ref5$gasToken = _ref5.gasToken, gasToken = _ref5$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref5$gasToken, _ref5$baseURL = _ref5.baseURL, baseURL = _ref5$baseURL === void 0 ? 'https://safe-relay.rinkeby.gnosis.pm/api' : _ref5$baseURL;

            if (safe) {
              _context4.next = 3;
              break;
            }

            throw new Error('Safe address is required');

          case 3:
            if (to) {
              _context4.next = 5;
              break;
            }

            throw new Error('To is required');

          case 5:
            if (value) {
              _context4.next = 7;
              break;
            }

            throw new Error('Value is required');

          case 7:
            _context4.next = 9;
            return (0, _axios["default"])({
              url: "/v2/safes/".concat(safe, "/transactions/estimate/"),
              method: 'post',
              data: {
                safe: safe,
                to: to,
                value: value,
                data: data,
                operation: operation,
                gasToken: gasToken
              },
              baseURL: baseURL
            });

          case 9:
            response = _context4.sent;
            _response$data = response.data, safeTxGas = _response$data.safeTxGas, baseGas = _response$data.baseGas, gasPrice = _response$data.gasPrice, lastUsedNonce = _response$data.lastUsedNonce;
            return _context4.abrupt("return", {
              safeTxGas: safeTxGas,
              baseGas: baseGas,
              gasPrice: gasPrice,
              nonce: lastUsedNonce || '0'
            });

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function estimateTx(_x4) {
    return _ref6.apply(this, arguments);
  };
}();

exports.estimateTx = estimateTx;

var executeTx =
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(_ref7) {
    var safe, privateKey, to, value, _ref7$data, data, _ref7$operation, operation, _ref7$gasToken, gasToken, safeTxGas, baseGas, gasPrice, _ref7$refundReceiver, refundReceiver, nonce, _ref7$baseURL, baseURL, signature;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            safe = _ref7.safe, privateKey = _ref7.privateKey, to = _ref7.to, value = _ref7.value, _ref7$data = _ref7.data, data = _ref7$data === void 0 ? '0x' : _ref7$data, _ref7$operation = _ref7.operation, operation = _ref7$operation === void 0 ? '0' : _ref7$operation, _ref7$gasToken = _ref7.gasToken, gasToken = _ref7$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref7$gasToken, safeTxGas = _ref7.safeTxGas, baseGas = _ref7.baseGas, gasPrice = _ref7.gasPrice, _ref7$refundReceiver = _ref7.refundReceiver, refundReceiver = _ref7$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref7$refundReceiver, nonce = _ref7.nonce, _ref7$baseURL = _ref7.baseURL, baseURL = _ref7$baseURL === void 0 ? 'https://safe-relay.rinkeby.gnosis.pm/api' : _ref7$baseURL;

            if (safe) {
              _context5.next = 3;
              break;
            }

            throw new Error('Safe address is required');

          case 3:
            if (privateKey) {
              _context5.next = 5;
              break;
            }

            throw new Error('Private key is required');

          case 5:
            if (to) {
              _context5.next = 7;
              break;
            }

            throw new Error('To is required');

          case 7:
            if (value) {
              _context5.next = 9;
              break;
            }

            throw new Error('Value is required');

          case 9:
            if (safeTxGas) {
              _context5.next = 11;
              break;
            }

            throw new Error('Safe tx gas is required');

          case 11:
            if (baseGas) {
              _context5.next = 13;
              break;
            }

            throw new Error('Base gas is required');

          case 13:
            if (gasPrice) {
              _context5.next = 15;
              break;
            }

            throw new Error('Gas price is required');

          case 15:
            if (nonce) {
              _context5.next = 17;
              break;
            }

            throw new Error('Nonce is required');

          case 17:
            _context5.next = 19;
            return (0, _signTx.signTx)({
              to: to,
              value: value,
              data: data,
              operation: operation,
              safeTxGas: safeTxGas,
              baseGas: baseGas,
              gasPrice: gasPrice,
              gasToken: gasToken,
              refundReceiver: refundReceiver,
              nonce: nonce,
              safe: safe,
              privateKey: privateKey
            });

          case 19:
            signature = _context5.sent;
            console.log({
              safe: safe,
              to: to,
              value: value,
              data: data,
              operation: operation,
              gasToken: gasToken,
              safeTxGas: safeTxGas,
              dataGas: baseGas,
              gasPrice: gasPrice,
              refundReceiver: refundReceiver,
              nonce: nonce,
              signatures: [signature]
            });
            return _context5.abrupt("return", (0, _axios["default"])({
              url: "/v1/safes/".concat(safe, "/transactions/"),
              method: 'post',
              data: {
                safe: safe,
                to: to,
                value: value,
                data: data,
                operation: operation,
                gasToken: gasToken,
                safeTxGas: parseInt(safeTxGas),
                dataGas: parseInt(baseGas),
                gasPrice: parseInt(gasPrice),
                refundReceiver: refundReceiver,
                nonce: parseInt(nonce),
                signatures: [signature]
              },
              baseURL: baseURL
            }));

          case 22:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function executeTx(_x5) {
    return _ref8.apply(this, arguments);
  };
}();

exports.executeTx = executeTx;