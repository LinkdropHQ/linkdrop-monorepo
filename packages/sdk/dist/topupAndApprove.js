"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.approveNFT = exports.approve = exports.topup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _ethers = require("ethers");

var _TokenMock = _interopRequireDefault(require("../../contracts/build/TokenMock.json"));

var _NFTMock = _interopRequireDefault(require("../../contracts/build/NFTMock.json"));

var topup = function topup(_ref) {
  var jsonRpcUrl, signingKeyOrWallet, proxyAddress, nativeTokensAmount, provider, tx;
  return _regenerator["default"].async(function topup$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          jsonRpcUrl = _ref.jsonRpcUrl, signingKeyOrWallet = _ref.signingKeyOrWallet, proxyAddress = _ref.proxyAddress, nativeTokensAmount = _ref.nativeTokensAmount;

          if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
            _context.next = 3;
            break;
          }

          throw new Error('Please provide json rpc url');

        case 3:
          if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
            _context.next = 5;
            break;
          }

          throw new Error('Please provide signing key or wallet');

        case 5:
          if (!(proxyAddress == null || proxyAddress === '')) {
            _context.next = 7;
            break;
          }

          throw new Error('Please provide proxy address');

        case 7:
          if (!(nativeTokensAmount == null || nativeTokensAmount === '')) {
            _context.next = 9;
            break;
          }

          throw new Error('Please provide native tokens amount');

        case 9:
          provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

          if (typeof signingKeyOrWallet === 'string') {
            signingKeyOrWallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
          }

          _context.next = 13;
          return _regenerator["default"].awrap(signingKeyOrWallet.sendTransaction({
            to: proxyAddress,
            value: nativeTokensAmount
          }));

        case 13:
          tx = _context.sent;
          return _context.abrupt("return", tx.hash);

        case 15:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.topup = topup;

var approve = function approve(_ref2) {
  var jsonRpcUrl, signingKeyOrWallet, proxyAddress, tokenAddress, tokensAmount, provider, tokenContract, tx;
  return _regenerator["default"].async(function approve$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          jsonRpcUrl = _ref2.jsonRpcUrl, signingKeyOrWallet = _ref2.signingKeyOrWallet, proxyAddress = _ref2.proxyAddress, tokenAddress = _ref2.tokenAddress, tokensAmount = _ref2.tokensAmount;

          if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
            _context2.next = 3;
            break;
          }

          throw new Error('Please provide json rpc url');

        case 3:
          if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
            _context2.next = 5;
            break;
          }

          throw new Error('Please provide signing key or wallet');

        case 5:
          if (!(proxyAddress == null || proxyAddress === '')) {
            _context2.next = 7;
            break;
          }

          throw new Error('Please provide proxy address');

        case 7:
          if (!(tokenAddress == null || tokenAddress === '')) {
            _context2.next = 9;
            break;
          }

          throw new Error('Please provide token address');

        case 9:
          if (!(tokensAmount == null || tokensAmount === '')) {
            _context2.next = 11;
            break;
          }

          throw new Error('Please provide tokens amount');

        case 11:
          provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

          if (typeof signingKeyOrWallet === 'string') {
            signingKeyOrWallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
          }

          tokenContract = new _ethers.ethers.Contract(tokenAddress, _TokenMock["default"].abi, signingKeyOrWallet);
          _context2.next = 16;
          return _regenerator["default"].awrap(tokenContract.approve(proxyAddress, tokensAmount));

        case 16:
          tx = _context2.sent;
          return _context2.abrupt("return", tx.hash);

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.approve = approve;

var approveNFT = function approveNFT(_ref3) {
  var jsonRpcUrl, signingKeyOrWallet, proxyAddress, nftAddress, provider, nftContract, tx;
  return _regenerator["default"].async(function approveNFT$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          jsonRpcUrl = _ref3.jsonRpcUrl, signingKeyOrWallet = _ref3.signingKeyOrWallet, proxyAddress = _ref3.proxyAddress, nftAddress = _ref3.nftAddress;

          if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
            _context3.next = 3;
            break;
          }

          throw new Error('Please provide json rpc url');

        case 3:
          if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
            _context3.next = 5;
            break;
          }

          throw new Error('Please provide signing key or wallet');

        case 5:
          if (!(proxyAddress == null || proxyAddress === '')) {
            _context3.next = 7;
            break;
          }

          throw new Error('Please provide proxy address');

        case 7:
          if (!(nftAddress == null || nftAddress === '')) {
            _context3.next = 9;
            break;
          }

          throw new Error('Please provide nft address');

        case 9:
          provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

          if (typeof signingKeyOrWallet === 'string') {
            signingKeyOrWallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
          }

          nftContract = new _ethers.ethers.Contract(nftAddress, _NFTMock["default"].abi, signingKeyOrWallet);
          _context3.next = 14;
          return _regenerator["default"].awrap(nftContract.setApprovalForAll(proxyAddress, true));

        case 14:
          tx = _context3.sent;
          return _context3.abrupt("return", tx.hash);

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.approveNFT = approveNFT;