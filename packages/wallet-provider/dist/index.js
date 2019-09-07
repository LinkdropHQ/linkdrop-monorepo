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

var ProviderEngine = require('web3-provider-engine');

var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

var CacheSubprovider = require('web3-provider-engine/subproviders/cache.js');

var FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');

var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

var HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js');

var SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions.js');

var ethers = require('ethers');

var Provider =
/*#__PURE__*/
function () {
  function Provider(opts) {
    (0, _classCallCheck2["default"])(this, Provider);
    this.ensName = opts.ensName;
    this.network = opts.network || 'mainnet';
    this.rpcUrl = opts.rpcUrl || "https://".concat(this.network, ".infura.io/v3/d4d1a2b933e048e28fb6fe1abe3e813a");
    this.confirmUrl = opts.confirmUrl;

    if (!opts.ensName) {
      throw new Error('ENS name should be provided');
    }

    if (!opts.network) {
      throw new Error('network should be provided');
    }

    this.provider = this._initProvider();
  }

  (0, _createClass2["default"])(Provider, [{
    key: "_getAddressFromEns",
    value: function () {
      var _getAddressFromEns2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(ensName, network) {
        var address, provider;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                provider = ethers.getDefaultProvider(network);
                _context.next = 4;
                return provider.resolveName(ensName);

              case 4:
                address = _context.sent;
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                throw new Error('Bad ENS name provided');

              case 10:
                return _context.abrupt("return", address);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 7]]);
      }));

      function _getAddressFromEns(_x, _x2) {
        return _getAddressFromEns2.apply(this, arguments);
      }

      return _getAddressFromEns;
    }()
  }, {
    key: "_getConfirmationUrlFromEns",
    value: function _getConfirmationUrlFromEns(ensName) {
      if (this.confirmUrl) return this.confirmUrl;
      return 'https://demo.wallet.linkdrop.io/#/confirm';
    }
  }, {
    key: "_initProvider",
    value: function _initProvider() {
      var _this = this;

      var engine = new ProviderEngine();
      var address;
      var confirmationUrl;
      engine.enable =
      /*#__PURE__*/
      (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _this._getAddressFromEns(_this.ensName, _this.network);

              case 2:
                address = _context2.sent;
                confirmationUrl = _this._getConfirmationUrlFromEns(_this.ensName);

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function _handleRequest2(_x3) {
        return _handleRequest.apply(this, arguments);
      }

      function _handleRequest() {
        _handleRequest = (0, _asyncToGenerator2["default"])(
        /*#__PURE__*/
        _regenerator["default"].mark(function _callee5(payload) {
          var result, message;
          return _regenerator["default"].wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  result = null;
                  _context5.prev = 1;
                  _context5.t0 = payload.method;
                  _context5.next = _context5.t0 === 'eth_accounts' ? 5 : _context5.t0 === 'eth_coinbase' ? 7 : _context5.t0 === 'eth_chainId' ? 9 : _context5.t0 === 'net_version' ? 10 : _context5.t0 === 'eth_uninstallFilter' ? 11 : 14;
                  break;

                case 5:
                  result = [address];
                  return _context5.abrupt("break", 16);

                case 7:
                  result = address;
                  return _context5.abrupt("break", 16);

                case 9:
                  throw new Error('eth_chainId call not implemented');

                case 10:
                  throw new Error('net_version call not implemented');

                case 11:
                  engine.Async(payload, function (_) {
                    return _;
                  });
                  result = true;
                  return _context5.abrupt("break", 16);

                case 14:
                  message = "Card Web3 object does not support synchronous methods like ".concat(payload.method, " without a callback parameter.");
                  throw new Error(message);

                case 16:
                  _context5.next = 21;
                  break;

                case 18:
                  _context5.prev = 18;
                  _context5.t1 = _context5["catch"](1);
                  throw _context5.t1;

                case 21:
                  return _context5.abrupt("return", {
                    id: payload.id,
                    jsonrpc: payload.jsonrpc,
                    result: result
                  });

                case 22:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, null, [[1, 18]]);
        }));
        return _handleRequest.apply(this, arguments);
      }

      engine.send =
      /*#__PURE__*/
      function () {
        var _ref2 = (0, _asyncToGenerator2["default"])(
        /*#__PURE__*/
        _regenerator["default"].mark(function _callee3(payload, callback) {
          var res;
          return _regenerator["default"].wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(typeof payload === 'string')) {
                    _context3.next = 2;
                    break;
                  }

                  return _context3.abrupt("return", new Promise(function (resolve, reject) {
                    engine.sendAsync({
                      jsonrpc: '2.0',
                      id: 42,
                      method: payload,
                      params: callback || []
                    }, function (error, response) {
                      if (error) {
                        reject(error);
                      } else {
                        resolve(response.result);
                      }
                    });
                  }));

                case 2:
                  if (!callback) {
                    _context3.next = 5;
                    break;
                  }

                  engine.sendAsync(payload, callback);
                  return _context3.abrupt("return");

                case 5:
                  _context3.next = 7;
                  return _handleRequest2(payload, callback);

                case 7:
                  res = _context3.sent;
                  return _context3.abrupt("return", res);

                case 9:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function (_x4, _x5) {
          return _ref2.apply(this, arguments);
        };
      }();

      var VERSION = 0.1; // #TODO move to auto

      var fixtureSubprovider = new FixtureSubprovider({
        web3_clientVersion: "LD/v".concat(VERSION, "/javascript"),
        net_listening: true,
        eth_hashrate: '0x00',
        eth_mining: false,
        eth_syncing: true
      }); // const nonceSubprovider = new NonceSubprovider()

      var cacheSubprovider = new CacheSubprovider(); // hack to deal with multiple received messages via PostMessage

      var cache = {};
      var walletSubprovider = new HookedWalletSubprovider({
        getAccounts: function getAccounts(cb) {
          var result = [address];
          var error = null;
          cb(error, result);
        },
        processTransaction: function processTransaction(txParams, cb) {
          var receiveMessage = function receiveMessage(event) {
            // Do we trust the sender of this message?
            // if (event.origin !== confirmationUrl) return
            if (event.origin !== confirmationUrl.substring(event.origin.length, -1)) return;

            if (event.data.action === 'PASS_TRANSACTION_RESULT') {
              var _event$data$payload = event.data.payload,
                  success = _event$data$payload.success,
                  txHash = _event$data$payload.txHash;

              if (cache[txHash]) {
                return null;
              }

              cache[txHash] = true;

              if (success) {
                cb(null, txHash);
              } else {
                var error = 'Transaction was rejected by user';
                cb(error);
              }
            }
          };

          window.addEventListener('message', receiveMessage, false);
          var newWindow = window.open(confirmationUrl, '_blank');
          setTimeout(function () {
            var data = {
              action: 'SEND_TRANSACTION',
              payload: {
                txParams: txParams
              }
            };
            newWindow.postMessage(data, confirmationUrl);
          }, 1000);
        }
      });
      /* ADD MIDDELWARE (PRESERVE ORDER) */

      engine.addProvider(fixtureSubprovider);
      engine.addProvider(cacheSubprovider);
      engine.addProvider(walletSubprovider);
      engine.addProvider(new RpcSubprovider({
        rpcUrl: this.rpcUrl
      }));
      engine.addProvider(new SubscriptionsSubprovider());
      engine.addProvider(new FilterSubprovider());
      /* END OF MIDDLEWARE */

      engine.addProvider({
        handleRequest: function () {
          var _handleRequest3 = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee4(payload, next, end) {
            var _ref3, result;

            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.prev = 0;
                    _context4.next = 3;
                    return _handleRequest2(payload);

                  case 3:
                    _ref3 = _context4.sent;
                    result = _ref3.result;
                    end(null, result);
                    _context4.next = 11;
                    break;

                  case 8:
                    _context4.prev = 8;
                    _context4.t0 = _context4["catch"](0);
                    end(_context4.t0);

                  case 11:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, null, [[0, 8]]);
          }));

          function handleRequest(_x6, _x7, _x8) {
            return _handleRequest3.apply(this, arguments);
          }

          return handleRequest;
        }(),
        setEngine: function setEngine(_) {
          return _;
        }
      });

      engine.isConnected = function () {
        return true;
      };

      engine.isEnsLogin = true;
      engine.on = false;
      engine.start();
      return engine;
    }
  }]);
  return Provider;
}();

var _default = Provider;
exports["default"] = _default;