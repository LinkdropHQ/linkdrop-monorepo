"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDeployed = exports.deployProxy = exports.connectToFactoryContract = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _LinkdropFactory = _interopRequireDefault(require("@linkdrop/contracts/build/LinkdropFactory.json"));

var _ethers = require("ethers");

var _axios = _interopRequireDefault(require("axios"));

var connectToFactoryContract =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var jsonRpcUrl, factoryAddress, signingKeyOrWallet, provider;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref.jsonRpcUrl, factoryAddress = _ref.factoryAddress, signingKeyOrWallet = _ref.signingKeyOrWallet;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context.next = 3;
              break;
            }

            throw new Error('Please provide json rpc url');

          case 3:
            if (!(factoryAddress == null || factoryAddress === '')) {
              _context.next = 5;
              break;
            }

            throw new Error('Please provide factory address');

          case 5:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context.next = 7;
              break;
            }

            throw new Error('Please provide signing key or wallet');

          case 7:
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

            if (typeof signingKeyOrWallet === 'string') {
              signingKeyOrWallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
            }

            return _context.abrupt("return", new _ethers.ethers.Contract(factoryAddress, _LinkdropFactory["default"].abi, signingKeyOrWallet));

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function connectToFactoryContract(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.connectToFactoryContract = connectToFactoryContract;

var deployProxy =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var jsonRpcUrl, factoryAddress, signingKeyOrWallet, campaignId, nativeTokensAmount, provider, factoryContract, data;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            jsonRpcUrl = _ref3.jsonRpcUrl, factoryAddress = _ref3.factoryAddress, signingKeyOrWallet = _ref3.signingKeyOrWallet, campaignId = _ref3.campaignId, nativeTokensAmount = _ref3.nativeTokensAmount;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context2.next = 3;
              break;
            }

            throw new Error('Please provide json rpc url');

          case 3:
            if (!(factoryAddress == null || factoryAddress === '')) {
              _context2.next = 5;
              break;
            }

            throw new Error('Please provide factory address');

          case 5:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context2.next = 7;
              break;
            }

            throw new Error('Please provide signing key or wallet');

          case 7:
            if (!(campaignId == null || campaignId === '')) {
              _context2.next = 9;
              break;
            }

            throw new Error('Please provide campaign id');

          case 9:
            if (!(nativeTokensAmount == null || nativeTokensAmount === '')) {
              _context2.next = 11;
              break;
            }

            throw new Error('Please provide native tokens amount');

          case 11:
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

            if (typeof signingKeyOrWallet === 'string') {
              signingKeyOrWallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
            }

            _context2.next = 15;
            return connectToFactoryContract({
              jsonRpcUrl: jsonRpcUrl,
              factoryAddress: factoryAddress,
              signingKeyOrWallet: signingKeyOrWallet
            });

          case 15:
            factoryContract = _context2.sent;

            if (!(nativeTokensAmount > 0)) {
              _context2.next = 19;
              break;
            }

            data = factoryContract["interface"].functions.deployProxy.encode(campaignId);
            return _context2.abrupt("return", signingKeyOrWallet.sendTransaction({
              to: factoryAddress,
              value: nativeTokensAmount,
              data: data
            }));

          case 19:
            return _context2.abrupt("return", factoryContract.deployProxy(campaignId));

          case 20:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function deployProxy(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.deployProxy = deployProxy;

var isDeployed =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(_ref5) {
    var senderAddress, campaignId, factoryAddress, jsonRpcUrl, provider, factoryContract;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            senderAddress = _ref5.senderAddress, campaignId = _ref5.campaignId, factoryAddress = _ref5.factoryAddress, jsonRpcUrl = _ref5.jsonRpcUrl;
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
            factoryContract = new _ethers.ethers.Contract(factoryAddress, _LinkdropFactory["default"].abi, provider);
            return _context3.abrupt("return", factoryContract['isDeployed(address,uint256)'](senderAddress, campaignId));

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function isDeployed(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.isDeployed = isDeployed;