"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDeployed = exports.deployProxy = exports.connectToFactoryContract = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _LinkdropFactory = _interopRequireDefault(require("@linkdrop/contracts/build/LinkdropFactory.json"));

var _ethers = require("ethers");

var _axios = _interopRequireDefault(require("axios"));

var connectToFactoryContract = function connectToFactoryContract(_ref) {
  var jsonRpcUrl, factoryAddress, signingKeyOrWallet, provider;
  return _regenerator["default"].async(function connectToFactoryContract$(_context) {
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
  });
};

exports.connectToFactoryContract = connectToFactoryContract;

var deployProxy = function deployProxy(_ref2) {
  var jsonRpcUrl, factoryAddress, signingKeyOrWallet, campaignId, nativeTokensAmount, provider, factoryContract, data;
  return _regenerator["default"].async(function deployProxy$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          jsonRpcUrl = _ref2.jsonRpcUrl, factoryAddress = _ref2.factoryAddress, signingKeyOrWallet = _ref2.signingKeyOrWallet, campaignId = _ref2.campaignId, nativeTokensAmount = _ref2.nativeTokensAmount;

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
          return _regenerator["default"].awrap(connectToFactoryContract({
            jsonRpcUrl: jsonRpcUrl,
            factoryAddress: factoryAddress,
            signingKeyOrWallet: signingKeyOrWallet
          }));

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
  });
};

exports.deployProxy = deployProxy;

var isDeployed = function isDeployed(_ref3) {
  var senderAddress, campaignId, factoryAddress, jsonRpcUrl, provider, factoryContract;
  return _regenerator["default"].async(function isDeployed$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          senderAddress = _ref3.senderAddress, campaignId = _ref3.campaignId, factoryAddress = _ref3.factoryAddress, jsonRpcUrl = _ref3.jsonRpcUrl;
          provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
          factoryContract = new _ethers.ethers.Contract(factoryAddress, _LinkdropFactory["default"].abi, provider);
          return _context3.abrupt("return", factoryContract['isDeployed(address,uint256)'](senderAddress, campaignId));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.isDeployed = isDeployed;