"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.approveERC721 = exports.approve = exports.topup = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethers = require("ethers");

var _TokenMock = _interopRequireDefault(require("../../contracts/build/TokenMock.json"));

var _NFTMock = _interopRequireDefault(require("../../contracts/build/NFTMock.json"));

var topup = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref) {
    var jsonRpcUrl, signingKeyOrWallet, proxyAddress, weiAmount, provider, wallet, tx;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref.jsonRpcUrl, signingKeyOrWallet = _ref.signingKeyOrWallet, proxyAddress = _ref.proxyAddress, weiAmount = _ref.weiAmount;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context.next = 3;
              break;
            }

            throw new Error("Please provide json rpc url");

          case 3:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context.next = 5;
              break;
            }

            throw new Error("Please provide signing key or wallet");

          case 5:
            if (!(proxyAddress == null || proxyAddress === '')) {
              _context.next = 7;
              break;
            }

            throw new Error("Please provide proxy address");

          case 7:
            if (!(weiAmount == null || weiAmount === '')) {
              _context.next = 9;
              break;
            }

            throw new Error("Please provide wei amount");

          case 9:
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

            if (typeof signingKeyOrWallet === 'string') {
              wallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
            } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
              wallet = signingKeyOrWallet;
            }

            _context.next = 13;
            return wallet.sendTransaction({
              to: proxyAddress,
              value: weiAmount
            });

          case 13:
            tx = _context.sent;
            return _context.abrupt("return", tx.hash);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function topup(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.topup = topup;

var approve = /*#__PURE__*/function () {
  var _ref4 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(_ref3) {
    var jsonRpcUrl, signingKeyOrWallet, proxyAddress, tokenAddress, tokenAmount, provider, wallet, tokenContract, tx;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            jsonRpcUrl = _ref3.jsonRpcUrl, signingKeyOrWallet = _ref3.signingKeyOrWallet, proxyAddress = _ref3.proxyAddress, tokenAddress = _ref3.tokenAddress, tokenAmount = _ref3.tokenAmount;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context2.next = 3;
              break;
            }

            throw new Error("Please provide json rpc url");

          case 3:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context2.next = 5;
              break;
            }

            throw new Error("Please provide signing key or wallet");

          case 5:
            if (!(proxyAddress == null || proxyAddress === '')) {
              _context2.next = 7;
              break;
            }

            throw new Error("Please provide proxy address");

          case 7:
            if (!(tokenAddress == null || tokenAddress === '')) {
              _context2.next = 9;
              break;
            }

            throw new Error("Please provide token address");

          case 9:
            if (!(tokenAmount == null || tokenAmount === '')) {
              _context2.next = 11;
              break;
            }

            throw new Error("Please provide token amount");

          case 11:
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

            if (typeof signingKeyOrWallet === 'string') {
              wallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
            } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
              wallet = signingKeyOrWallet;
            }

            tokenContract = new _ethers.ethers.Contract(tokenAddress, _TokenMock["default"].abi, wallet);
            _context2.next = 16;
            return tokenContract.approve(proxyAddress, tokenAmount);

          case 16:
            tx = _context2.sent;
            return _context2.abrupt("return", tx.hash);

          case 18:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function approve(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.approve = approve;

var approveERC721 = /*#__PURE__*/function () {
  var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(_ref5) {
    var jsonRpcUrl, signingKeyOrWallet, proxyAddress, nftAddress, provider, wallet, nftContract, tx;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            jsonRpcUrl = _ref5.jsonRpcUrl, signingKeyOrWallet = _ref5.signingKeyOrWallet, proxyAddress = _ref5.proxyAddress, nftAddress = _ref5.nftAddress;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context3.next = 3;
              break;
            }

            throw new Error("Please provide json rpc url");

          case 3:
            if (!(signingKeyOrWallet == null || signingKeyOrWallet === '')) {
              _context3.next = 5;
              break;
            }

            throw new Error("Please provide signing key or wallet");

          case 5:
            if (!(proxyAddress == null || proxyAddress === '')) {
              _context3.next = 7;
              break;
            }

            throw new Error("Please provide proxy address");

          case 7:
            if (!(nftAddress == null || nftAddress === '')) {
              _context3.next = 9;
              break;
            }

            throw new Error("Please provide nft address");

          case 9:
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);

            if (typeof signingKeyOrWallet === 'string') {
              wallet = new _ethers.ethers.Wallet(signingKeyOrWallet, provider);
            } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
              wallet = signingKeyOrWallet;
            }

            nftContract = new _ethers.ethers.Contract(nftAddress, _NFTMock["default"].abi, wallet);
            _context3.next = 14;
            return nftContract.setApprovalForAll(proxyAddress, true);

          case 14:
            tx = _context3.sent;
            return _context3.abrupt("return", tx.hash);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function approveERC721(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.approveERC721 = approveERC721;