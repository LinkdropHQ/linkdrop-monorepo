"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUrlParams = exports._getFutureWalletFactory = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _BalanceObserver = require("@universal-login/sdk/dist/lib/core/observers/BalanceObserver");

var _FutureWalletFactory = require("@universal-login/sdk/dist/lib/api/FutureWalletFactory");

var _commons = require("@universal-login/commons");

var _path = _interopRequireDefault(require("path"));

var _csvtojson = _interopRequireDefault(require("csvtojson"));

var _queryString = _interopRequireDefault(require("query-string"));

var _this = void 0;

var _getFutureWalletFactory =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var futureWalletConfig;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _commons.ensureNotNull)(_this.sdk.config, Error, 'Relayer configuration not yet loaded');
            futureWalletConfig = {
              supportedTokens: _this.sdk.config.supportedTokens,
              factoryAddress: _this.sdk.config.factoryAddress,
              contractWhiteList: _this.sdk.config.contractWhiteList,
              chainSpec: _this.sdk.config.chainSpec
            };
            _this.sdk.futureWalletFactory = _this.sdk.futureWalletFactory || new _FutureWalletFactory.FutureWalletFactory(futureWalletConfig, _this.sdk.provider, _this.sdk.blockchainService, _this.sdk.relayerApi);

          case 3:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function _getFutureWalletFactory() {
    return _ref.apply(this, arguments);
  };
}();

exports._getFutureWalletFactory = _getFutureWalletFactory;

var getUrlParams =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(type, i) {
    var csvFilePath, jsonArray, rawUrl, parsedUrl, parsed;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            csvFilePath = _path["default"].resolve(__dirname, "../output/linkdrop_".concat(type, ".csv"));
            _context2.next = 3;
            return (0, _csvtojson["default"])().fromFile(csvFilePath);

          case 3:
            jsonArray = _context2.sent;
            rawUrl = jsonArray[i].url.replace('#', '');
            _context2.next = 7;
            return _queryString["default"].extract(rawUrl);

          case 7:
            parsedUrl = _context2.sent;
            _context2.next = 10;
            return _queryString["default"].parse(parsedUrl);

          case 10:
            parsed = _context2.sent;
            return _context2.abrupt("return", parsed);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function getUrlParams(_x, _x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getUrlParams = getUrlParams;