"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getFutureWalletFactory = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _BalanceObserver = require("@universal-login/sdk/dist/lib/core/observers/BalanceObserver");

var _FutureWalletFactory = require("@universal-login/sdk/dist/lib/api/FutureWalletFactory");

var _commons = require("@universal-login/commons");

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