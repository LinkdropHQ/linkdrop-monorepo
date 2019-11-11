"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deployProxy = exports.connectToFactoryContract = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _LinkdropFactory = _interopRequireDefault(require("@linkdrop/contracts/build/LinkdropFactory.json"));

var _ethers = require("ethers");

var connectToFactoryContract = function connectToFactoryContract(_ref) {
  var jsonRpcUrl, factoryAddress, signingKeyOrWallet, provider, wallet;
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
          if (!(factoryAddress === null || factoryAddress === '')) {
            _context.next = 5;
            break;
          }

          throw new Error('Please provide factory address');

        case 5:
          if (!(signingKeyOrWallet === null || signingKeyOrWallet === '')) {
            _context.next = 7;
            break;
          }

          throw new Error('Please provide signing key or wallet');

        case 7:
          provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

          if (typeof signingKeyOrWallet === 'string') {
            wallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
          } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
            wallet = signingKeyOrWallet;
          }

          return _context.abrupt("return", new _ethers.ethers.Contract(factoryAddress, _LinkdropFactory["default"].abi, wallet));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.connectToFactoryContract = connectToFactoryContract;

var deployProxy = function deployProxy(_ref2) {
  var jsonRpcUrl, factoryAddress, signingKeyOrWallet, campaignId, weiAmount, provider, wallet, factoryContract, data;
  return _regenerator["default"].async(function deployProxy$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          jsonRpcUrl = _ref2.jsonRpcUrl, factoryAddress = _ref2.factoryAddress, signingKeyOrWallet = _ref2.signingKeyOrWallet, campaignId = _ref2.campaignId, weiAmount = _ref2.weiAmount;

          if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
            _context2.next = 3;
            break;
          }

          throw new Error('Please provide json rpc url');

        case 3:
          if (!(factoryAddress === null || factoryAddress === '')) {
            _context2.next = 5;
            break;
          }

          throw new Error('Please provide factory address');

        case 5:
          if (!(signingKeyOrWallet === null || signingKeyOrWallet === '')) {
            _context2.next = 7;
            break;
          }

          throw new Error('Please provide signing key or wallet');

        case 7:
          if (!(campaignId === null || campaignId === '')) {
            _context2.next = 9;
            break;
          }

          throw new Error('Please provide campaign id');

        case 9:
          provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

          if (typeof signingKeyOrWallet === 'string') {
            wallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
          } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
            wallet = signingKeyOrWallet;
          }

          _context2.next = 13;
          return _regenerator["default"].awrap(connectToFactoryContract({
            jsonRpcUrl: jsonRpcUrl,
            factoryAddress: factoryAddress,
            signingKeyOrWallet: signingKeyOrWallet
          }));

        case 13:
          factoryContract = _context2.sent;

          if (!(weiAmount > 0)) {
            _context2.next = 17;
            break;
          }

          data = factoryContract["interface"].functions.deployProxy.encode(campaignId);
          return _context2.abrupt("return", wallet.sendTransaction({
            to: factoryAddress,
            value: weiAmount,
            data: data
          }));

        case 17:
          return _context2.abrupt("return", factoryContract.deployProxy(campaignId));

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.deployProxy = deployProxy;