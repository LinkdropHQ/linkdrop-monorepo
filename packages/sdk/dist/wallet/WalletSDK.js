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

var _ethers = require("ethers");

var _utils = require("./utils");

var _computeSafeAddress2 = require("./computeSafeAddress");

var _createSafe = require("./createSafe");

var _signTx2 = require("./signTx");

var _executeTx3 = require("./executeTx");

var _ensUtils = require("./ensUtils");

var WalletSDK =
/*#__PURE__*/
function () {
  function WalletSDK() // from https://safe-relay.gnosis.pm/api/v1/about/
  {
    var chain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'rinkeby';
    var gnosisSafeMasterCopy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0xb6029EA3B2c51D09a50B53CA8012FeEB05bDa35A';
    var proxyFactory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0x12302fE9c02ff50939BaAaaf415fc226C078613C';
    (0, _classCallCheck2["default"])(this, WalletSDK);
    this.chain = chain;
    this.jsonRpcUrl = "https://".concat(chain, ".infura.io");
    this.apiHost = 'http://localhost:5050';
    this.gnosisSafeMasterCopy = gnosisSafeMasterCopy;
    this.proxyFactory = proxyFactory;
  }
  /**
   * @dev Function to get encoded params data from contract abi
   * @param {Object} abi Contract abi
   * @param {String} method Function name
   * @param {Array<T>} params Array of function params to be encoded
   * @return Encoded params data
   */


  (0, _createClass2["default"])(WalletSDK, [{
    key: "encodeParams",
    value: function encodeParams(abi, method, params) {
      return (0, _utils.encodeParams)(abi, method, params);
    }
  }, {
    key: "encodeDataForMultiSend",
    value: function encodeDataForMultiSend(operation, to, value, data) {
      return (0, _utils.encodeDataForMultiSend)(operation, to, value, data);
    }
    /**
     * Function to get specific param from transaction event
     * @param {Object} tx Transaction object compatible with ethers.js library
     * @param {String} eventName Event name to parse param from
     * @param {String} paramName Parameter to be retrieved from event log
     * @param {Object} contract Contract instance compatible with ethers.js library
     * @return {String} Parameter parsed from transaction event
     */

  }, {
    key: "getParamFromTxEvent",
    value: function () {
      var _getParamFromTxEvent2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(tx, eventName, paramName, contract) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", (0, _utils.getParamFromTxEvent)(tx, eventName, paramName, contract));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getParamFromTxEvent(_x, _x2, _x3, _x4) {
        return _getParamFromTxEvent2.apply(this, arguments);
      }

      return getParamFromTxEvent;
    }()
    /**
     * Function to calculate the safe address based on given params
     * @param {String} owner Safe owner address
     * @param {String | Number} saltNonce Random salt nonce
     * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
     * @param {String} proxyFactory Deployed proxy factory address
     */

  }, {
    key: "computeSafeAddress",
    value: function computeSafeAddress(_ref) {
      var owner = _ref.owner,
          saltNonce = _ref.saltNonce,
          _ref$gnosisSafeMaster = _ref.gnosisSafeMasterCopy,
          gnosisSafeMasterCopy = _ref$gnosisSafeMaster === void 0 ? this.gnosisSafeMasterCopy : _ref$gnosisSafeMaster,
          _ref$proxyFactory = _ref.proxyFactory,
          proxyFactory = _ref$proxyFactory === void 0 ? this.proxyFactory : _ref$proxyFactory,
          _ref$jsonRpcUrl = _ref.jsonRpcUrl,
          jsonRpcUrl = _ref$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref$jsonRpcUrl;
      return (0, _computeSafeAddress2.computeSafeAddress)({
        owner: owner,
        saltNonce: saltNonce,
        gnosisSafeMasterCopy: gnosisSafeMasterCopy,
        proxyFactory: proxyFactory,
        jsonRpcUrl: jsonRpcUrl
      });
    }
    /**
     * Function to create new safe
     * @param {String} owner Safe owner's address
     * @param {String} name ENS name to register for safe
     * @param {String} apiHost API host (optional)
     * @returns {Object} {success, txHash, safe, errors}
     */

  }, {
    key: "create",
    value: function () {
      var _create2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref2) {
        var owner, name, _ref2$apiHost, apiHost;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                owner = _ref2.owner, name = _ref2.name, _ref2$apiHost = _ref2.apiHost, apiHost = _ref2$apiHost === void 0 ? this.apiHost : _ref2$apiHost;
                return _context2.abrupt("return", (0, _createSafe.create)({
                  owner: owner,
                  name: name,
                  apiHost: apiHost
                }));

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function create(_x5) {
        return _create2.apply(this, arguments);
      }

      return create;
    }()
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

  }, {
    key: "executeTx",
    value: function () {
      var _executeTx2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref3) {
        var safe, privateKey, to, value, _ref3$data, data, _ref3$operation, operation, _ref3$safeTxGas, safeTxGas, _ref3$baseGas, baseGas, _ref3$gasPrice, gasPrice, _ref3$gasToken, gasToken, _ref3$refundReceiver, refundReceiver, _ref3$apiHost, apiHost, _ref3$jsonRpcUrl, jsonRpcUrl;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                safe = _ref3.safe, privateKey = _ref3.privateKey, to = _ref3.to, value = _ref3.value, _ref3$data = _ref3.data, data = _ref3$data === void 0 ? '0x' : _ref3$data, _ref3$operation = _ref3.operation, operation = _ref3$operation === void 0 ? 0 : _ref3$operation, _ref3$safeTxGas = _ref3.safeTxGas, safeTxGas = _ref3$safeTxGas === void 0 ? 0 : _ref3$safeTxGas, _ref3$baseGas = _ref3.baseGas, baseGas = _ref3$baseGas === void 0 ? 0 : _ref3$baseGas, _ref3$gasPrice = _ref3.gasPrice, gasPrice = _ref3$gasPrice === void 0 ? 0 : _ref3$gasPrice, _ref3$gasToken = _ref3.gasToken, gasToken = _ref3$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref3$gasToken, _ref3$refundReceiver = _ref3.refundReceiver, refundReceiver = _ref3$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref3$refundReceiver, _ref3$apiHost = _ref3.apiHost, apiHost = _ref3$apiHost === void 0 ? this.apiHost : _ref3$apiHost, _ref3$jsonRpcUrl = _ref3.jsonRpcUrl, jsonRpcUrl = _ref3$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref3$jsonRpcUrl;
                return _context3.abrupt("return", (0, _executeTx3.executeTx)({
                  apiHost: apiHost,
                  jsonRpcUrl: jsonRpcUrl,
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
                  refundReceiver: refundReceiver
                }));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function executeTx(_x6) {
        return _executeTx2.apply(this, arguments);
      }

      return executeTx;
    }()
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

  }, {
    key: "signTx",
    value: function signTx(_ref4) {
      var safe = _ref4.safe,
          privateKey = _ref4.privateKey,
          to = _ref4.to,
          value = _ref4.value,
          _ref4$data = _ref4.data,
          data = _ref4$data === void 0 ? '0x' : _ref4$data,
          _ref4$operation = _ref4.operation,
          operation = _ref4$operation === void 0 ? 0 : _ref4$operation,
          _ref4$safeTxGas = _ref4.safeTxGas,
          safeTxGas = _ref4$safeTxGas === void 0 ? 0 : _ref4$safeTxGas,
          _ref4$baseGas = _ref4.baseGas,
          baseGas = _ref4$baseGas === void 0 ? 0 : _ref4$baseGas,
          _ref4$gasPrice = _ref4.gasPrice,
          gasPrice = _ref4$gasPrice === void 0 ? 0 : _ref4$gasPrice,
          _ref4$gasToken = _ref4.gasToken,
          gasToken = _ref4$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref4$gasToken,
          _ref4$refundReceiver = _ref4.refundReceiver,
          refundReceiver = _ref4$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref4$refundReceiver,
          nonce = _ref4.nonce;
      return (0, _signTx2.signTx)({
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
        nonce: nonce
      });
    }
    /**
     * Function to get owner of ENS identifier
     * @param {String} name ENS identifier (e.g 'alice.eth')
     * @param {String} chain Chain identifier (optional)
     * @param {String} jsonRpcUrl JSON RPC URL (optional)
     * @return {String} ENS identifier owner's address
     */

  }, {
    key: "getEnsOwner",
    value: function () {
      var _getEnsOwner2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref5) {
        var name, _ref5$chain, chain, _ref5$jsonRpcUrl, jsonRpcUrl;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                name = _ref5.name, _ref5$chain = _ref5.chain, chain = _ref5$chain === void 0 ? this.chain : _ref5$chain, _ref5$jsonRpcUrl = _ref5.jsonRpcUrl, jsonRpcUrl = _ref5$jsonRpcUrl === void 0 ? this.jsonRpcUrl : _ref5$jsonRpcUrl;
                return _context4.abrupt("return", (0, _ensUtils.getEnsOwner)({
                  name: name,
                  chain: chain,
                  jsonRpcUrl: jsonRpcUrl
                }));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getEnsOwner(_x7) {
        return _getEnsOwner2.apply(this, arguments);
      }

      return getEnsOwner;
    }()
    /**
     *
     * @param {String} weiAmount Wei amount
     * @param {String} tokenAddress Token address
     * @param {String} tokenAmount Token amount
     * @param {String} expirationTime Link expiration timestamp
     * @param {String} linkKey Ephemeral key assigned to link
     * @param {String} linkdropMasterAddress Linkdrop master address
     * @param {String} linkdropSignerSignature Linkdrop signer signature
     * @param {String} campaignId Campaign id
     * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address (optional)
     * @param {String} proxyFactory Deployed proxy factory address (optional)
     * @param {String} owner Safe owner address
     * @param {String} name ENS name to register for safe
     * @param {String} apiHost API host (optional)
     * @returns {Object} {success, txHash, safe, errors}
     */

  }, {
    key: "claimAndCreate",
    value: function () {
      var _claimAndCreate2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref6) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, _ref6$gnosisSafeMaste, gnosisSafeMasterCopy, _ref6$proxyFactory, proxyFactory, owner, name, _ref6$apiHost, apiHost;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                weiAmount = _ref6.weiAmount, tokenAddress = _ref6.tokenAddress, tokenAmount = _ref6.tokenAmount, expirationTime = _ref6.expirationTime, linkKey = _ref6.linkKey, linkdropMasterAddress = _ref6.linkdropMasterAddress, linkdropSignerSignature = _ref6.linkdropSignerSignature, campaignId = _ref6.campaignId, _ref6$gnosisSafeMaste = _ref6.gnosisSafeMasterCopy, gnosisSafeMasterCopy = _ref6$gnosisSafeMaste === void 0 ? this.gnosisSafeMasterCopy : _ref6$gnosisSafeMaste, _ref6$proxyFactory = _ref6.proxyFactory, proxyFactory = _ref6$proxyFactory === void 0 ? this.proxyFactory : _ref6$proxyFactory, owner = _ref6.owner, name = _ref6.name, _ref6$apiHost = _ref6.apiHost, apiHost = _ref6$apiHost === void 0 ? this.apiHost : _ref6$apiHost;
                return _context5.abrupt("return", (0, _createSafe.claimAndCreate)({
                  weiAmount: weiAmount,
                  tokenAddress: tokenAddress,
                  tokenAmount: tokenAmount,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropMasterAddress: linkdropMasterAddress,
                  linkdropSignerSignature: linkdropSignerSignature,
                  campaignId: campaignId,
                  gnosisSafeMasterCopy: gnosisSafeMasterCopy,
                  proxyFactory: proxyFactory,
                  owner: owner,
                  name: name,
                  apiHost: apiHost
                }));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function claimAndCreate(_x8) {
        return _claimAndCreate2.apply(this, arguments);
      }

      return claimAndCreate;
    }()
  }]);
  return WalletSDK;
}();

var _default = WalletSDK;
exports["default"] = _default;