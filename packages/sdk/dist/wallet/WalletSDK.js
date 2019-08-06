"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _utils = require("./utils");

var WalletSDK =
/*#__PURE__*/
function () {
  //
  function WalletSDK() {
    var safe = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var privateKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var chain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'rinkeby';
    (0, _classCallCheck2["default"])(this, WalletSDK);

    if (chain !== 'mainnet' && chain !== 'rinkeby') {
      throw new Error('Chain not supported');
    }

    this.chain = chain;
    this.connect({
      safe: safe,
      privateKey: privateKey
    });
    this.baseURL = chain === 'mainnet' ? 'https://safe-relay.gnosis.pm/api' : 'https://safe-relay.rinkeby.gnosis.pm/api';
  }

  (0, _createClass2["default"])(WalletSDK, [{
    key: "getAddress",
    value: function () {
      var _getAddress = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var owners, threshold, saltNonce, response;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                owners = _ref.owners, threshold = _ref.threshold, saltNonce = _ref.saltNonce;
                _context.prev = 1;
                _context.next = 4;
                return (0, _utils.triggerSafeDeployment)({
                  owners: owners,
                  threshold: threshold,
                  saltNonce: saltNonce
                }, this.baseURL);

              case 4:
                response = _context.sent;
                return _context.abrupt("return", response.data.safe);

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);

                if (_context.t0.response) {
                  console.log(_context.t0.response.data);
                  console.log(_context.t0.response.status);
                }

                throw new Error('Error occured while triggering Safe deployment');

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 8]]);
      }));

      function getAddress(_x) {
        return _getAddress.apply(this, arguments);
      }

      return getAddress;
    }()
  }, {
    key: "connect",
    value: function connect(_ref2) {
      var privateKey = _ref2.privateKey,
          safe = _ref2.safe;
      this.privateKey = privateKey;
      this.safe = safe;
    }
  }, {
    key: "_checkConnect",
    value: function _checkConnect() {
      if (!this.privateKey) {
        throw new Error('This action requires a connected private key');
      }

      if (!this.safe) {
        throw new Error('This action requires a connected safe');
      }
    }
  }, {
    key: "executeTransaction",
    value: function () {
      var _executeTransaction = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref3) {
        var to, value, data, operation, gasToken, _ref4, safeTxGas, baseGas, gasPrice, nonce, response;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                to = _ref3.to, value = _ref3.value, data = _ref3.data, operation = _ref3.operation, gasToken = _ref3.gasToken;

                this._checkConnect();

                _context2.prev = 2;
                _context2.next = 5;
                return (0, _utils.estimateTx)({
                  safe: this.safe,
                  to: to,
                  value: value,
                  data: data,
                  operation: operation,
                  gasToken: gasToken
                });

              case 5:
                _ref4 = _context2.sent;
                safeTxGas = _ref4.safeTxGas;
                baseGas = _ref4.baseGas;
                gasPrice = _ref4.gasPrice;
                nonce = _ref4.nonce;
                console.log({
                  safeTxGas: safeTxGas,
                  baseGas: baseGas,
                  gasPrice: gasPrice,
                  nonce: nonce
                });
                _context2.next = 13;
                return (0, _utils.executeTx)({
                  to: to,
                  value: value,
                  data: data,
                  operation: operation,
                  gasToken: gasToken,
                  safeTxGas: safeTxGas,
                  baseGas: baseGas,
                  gasPrice: gasPrice,
                  nonce: nonce,
                  safe: this.safe,
                  privateKey: this.privateKey
                });

              case 13:
                response = _context2.sent;
                console.log({
                  response: response
                });
                return _context2.abrupt("return", response);

              case 18:
                _context2.prev = 18;
                _context2.t0 = _context2["catch"](2);

                if (_context2.t0.response) {
                  console.log(_context2.t0.response.data);
                  console.log(_context2.t0.response.status);
                }

                throw new Error('Error occured while executing safe tx');

              case 22:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 18]]);
      }));

      function executeTransaction(_x2) {
        return _executeTransaction.apply(this, arguments);
      }

      return executeTransaction;
    }()
  }]);
  return WalletSDK;
}();

var _default = WalletSDK;
exports["default"] = _default;