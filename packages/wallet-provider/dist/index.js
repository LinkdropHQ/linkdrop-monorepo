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

var _connectToChild = _interopRequireDefault(require("penpal/lib/connectToChild"));

var _styles = require("./styles");

var ProviderEngine = require('web3-provider-engine');

var RpcSubprovider = require('web3-provider-engine/subproviders/rpc');

var CacheSubprovider = require('web3-provider-engine/subproviders/cache.js');

var FixtureSubprovider = require('web3-provider-engine/subproviders/fixture.js');

var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');

var HookedWalletSubprovider = require('web3-provider-engine/subproviders/hooked-wallet.js');

var SubscriptionsSubprovider = require('web3-provider-engine/subproviders/subscriptions.js');

var Provider =
/*#__PURE__*/
function () {
  function Provider(opts) {
    (0, _classCallCheck2["default"])(this, Provider);
    this.ensName = opts.ensName;
    this.network = opts.network || 'mainnet';
    this.rpcUrl = opts.rpcUrl || "https://".concat(this.network, ".infura.io/v3/d4d1a2b933e048e28fb6fe1abe3e813a");
    this.widgetUrl = opts.widgetUrl;

    if (!opts.ensName) {
      throw new Error('ENS name should be provided');
    }

    if (!opts.network) {
      throw new Error('network should be provided');
    }

    this.widget = null;
    this.provider = this._initProvider();
  }

  (0, _createClass2["default"])(Provider, [{
    key: "_initWidget",
    value: function _initWidget() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var onload =
        /*#__PURE__*/
        function () {
          var _ref = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee() {
            var style, container, iframe, connection, communication;
            return _regenerator["default"].wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    style = document.createElement('style');
                    style.innerHTML = _styles.styles;
                    container = document.createElement('div');
                    container.className = 'ld-widget-container';
                    iframe = document.createElement('iframe');
                    iframe.src = _this.widgetUrl || 'https://demo.wallet.linkdrop.io/#/widget';
                    iframe.className = 'ld-widget-iframe';
                    container.appendChild(iframe);
                    document.body.appendChild(container);
                    document.head.appendChild(style);
                    connection = (0, _connectToChild["default"])({
                      // The iframe to which a connection should be made
                      iframe: iframe,
                      // Methods the parent is exposing to the child
                      methods: {
                        showWidget: _this._showWidget.bind(_this),
                        hideWidget: _this._hideWidget.bind(_this)
                      }
                    });
                    _context.next = 13;
                    return connection.promise;

                  case 13:
                    communication = _context.sent;
                    resolve({
                      iframe: iframe,
                      communication: communication
                    });

                  case 15:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function onload() {
            return _ref.apply(this, arguments);
          };
        }();

        if (['loaded', 'interactive', 'complete'].indexOf(document.readyState) > -1) {
          onload();
        } else {
          window.addEventListener('load', onload.bind(_this), false);
        }
      });
    }
  }, {
    key: "_showWidget",
    value: function _showWidget() {
      this.widget.iframe.style.display = 'block';
    }
  }, {
    key: "_hideWidget",
    value: function _hideWidget() {
      this.widget.iframe.style.display = 'none';
    }
  }, {
    key: "_initProvider",
    value: function _initProvider() {
      var _this2 = this;

      var engine = new ProviderEngine();
      var address;
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
                return _this2._initWidget();

              case 2:
                _this2.widget = _context2.sent;
                _context2.next = 5;
                return _this2.widget.communication.connect();

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function _handleRequest2(_x) {
        return _handleRequest.apply(this, arguments);
      }

      function _handleRequest() {
        _handleRequest = (0, _asyncToGenerator2["default"])(
        /*#__PURE__*/
        _regenerator["default"].mark(function _callee7(payload) {
          var result, message;
          return _regenerator["default"].wrap(function _callee7$(_context7) {
            while (1) {
              switch (_context7.prev = _context7.next) {
                case 0:
                  result = null;
                  _context7.prev = 1;
                  _context7.t0 = payload.method;
                  _context7.next = _context7.t0 === 'eth_accounts' ? 5 : _context7.t0 === 'eth_coinbase' ? 7 : _context7.t0 === 'eth_chainId' ? 9 : _context7.t0 === 'net_version' ? 10 : _context7.t0 === 'eth_uninstallFilter' ? 11 : 14;
                  break;

                case 5:
                  result = [address];
                  return _context7.abrupt("break", 16);

                case 7:
                  result = address;
                  return _context7.abrupt("break", 16);

                case 9:
                  throw new Error('eth_chainId call not implemented');

                case 10:
                  throw new Error('net_version call not implemented');

                case 11:
                  engine.Async(payload, function (_) {
                    return _;
                  });
                  result = true;
                  return _context7.abrupt("break", 16);

                case 14:
                  message = "Card Web3 object does not support synchronous methods like ".concat(payload.method, " without a callback parameter.");
                  throw new Error(message);

                case 16:
                  _context7.next = 21;
                  break;

                case 18:
                  _context7.prev = 18;
                  _context7.t1 = _context7["catch"](1);
                  throw _context7.t1;

                case 21:
                  return _context7.abrupt("return", {
                    id: payload.id,
                    jsonrpc: payload.jsonrpc,
                    result: result
                  });

                case 22:
                case "end":
                  return _context7.stop();
              }
            }
          }, _callee7, null, [[1, 18]]);
        }));
        return _handleRequest.apply(this, arguments);
      }

      engine.send =
      /*#__PURE__*/
      function () {
        var _ref3 = (0, _asyncToGenerator2["default"])(
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

        return function (_x2, _x3) {
          return _ref3.apply(this, arguments);
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

      var walletSubprovider = new HookedWalletSubprovider({
        getAccounts: function () {
          var _getAccounts = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee4(cb) {
            var result, error;
            return _regenerator["default"].wrap(function _callee4$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.prev = 0;
                    _context4.next = 3;
                    return _this2.widget.communication.getAccounts();

                  case 3:
                    result = _context4.sent;
                    _context4.next = 9;
                    break;

                  case 6:
                    _context4.prev = 6;
                    _context4.t0 = _context4["catch"](0);
                    error = _context4.t0;

                  case 9:
                    cb(error, result);

                  case 10:
                  case "end":
                    return _context4.stop();
                }
              }
            }, _callee4, null, [[0, 6]]);
          }));

          function getAccounts(_x4) {
            return _getAccounts.apply(this, arguments);
          }

          return getAccounts;
        }(),
        processTransaction: function () {
          var _processTransaction = (0, _asyncToGenerator2["default"])(
          /*#__PURE__*/
          _regenerator["default"].mark(function _callee5(txParams, cb) {
            var result, error, _ref4, txHash, success, errors;

            return _regenerator["default"].wrap(function _callee5$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.prev = 0;
                    _context5.next = 3;
                    return _this2.widget.communication.sendTransaction(txParams);

                  case 3:
                    _ref4 = _context5.sent;
                    txHash = _ref4.txHash;
                    success = _ref4.success;
                    errors = _ref4.errors;

                    if (success) {
                      result = txHash;
                    } else {
                      error = errors[0] || 'Error while sending transaction';
                    }

                    _context5.next = 13;
                    break;

                  case 10:
                    _context5.prev = 10;
                    _context5.t0 = _context5["catch"](0);
                    error = _context5.t0;

                  case 13:
                    cb(error, result);

                  case 14:
                  case "end":
                    return _context5.stop();
                }
              }
            }, _callee5, null, [[0, 10]]);
          }));

          function processTransaction(_x5, _x6) {
            return _processTransaction.apply(this, arguments);
          }

          return processTransaction;
        }()
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
          _regenerator["default"].mark(function _callee6(payload, next, end) {
            var _ref5, result;

            return _regenerator["default"].wrap(function _callee6$(_context6) {
              while (1) {
                switch (_context6.prev = _context6.next) {
                  case 0:
                    _context6.prev = 0;
                    _context6.next = 3;
                    return _handleRequest2(payload);

                  case 3:
                    _ref5 = _context6.sent;
                    result = _ref5.result;
                    end(null, result);
                    _context6.next = 11;
                    break;

                  case 8:
                    _context6.prev = 8;
                    _context6.t0 = _context6["catch"](0);
                    end(_context6.t0);

                  case 11:
                  case "end":
                    return _context6.stop();
                }
              }
            }, _callee6, null, [[0, 8]]);
          }));

          function handleRequest(_x7, _x8, _x9) {
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