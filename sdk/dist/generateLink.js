"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateLinkERC721 = exports.generateLink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("./utils");

var ethers = require('ethers'); // Turn off annoying warnings


ethers.errors.setLogLevel('error');

var generateLink =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var factoryAddress, chainId, claimHost, linkdropMasterAddress, signingKeyOrWallet, weiAmount, tokenAddress, tokenAmount, expirationTime, version, campaignId, linkdropSigner, proxyAddress, _ref3, linkKey, linkId, linkdropSignerSignature, url;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            factoryAddress = _ref.factoryAddress, chainId = _ref.chainId, claimHost = _ref.claimHost, linkdropMasterAddress = _ref.linkdropMasterAddress, signingKeyOrWallet = _ref.signingKeyOrWallet, weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, version = _ref.version, campaignId = _ref.campaignId;

            if (!(factoryAddress === null || factoryAddress === '')) {
              _context.next = 3;
              break;
            }

            throw new Error('Please provide factory address');

          case 3:
            if (!(chainId === null || chainId === '')) {
              _context.next = 5;
              break;
            }

            throw new Error('Please provide chainId');

          case 5:
            if (!(claimHost === null || claimHost === '')) {
              _context.next = 7;
              break;
            }

            throw new Error('Please provide claim host');

          case 7:
            if (!(linkdropMasterAddress === null || linkdropMasterAddress === '')) {
              _context.next = 9;
              break;
            }

            throw new Error("Please provide linkdrop master's address");

          case 9:
            if (!(signingKeyOrWallet === null || signingKeyOrWallet === '')) {
              _context.next = 11;
              break;
            }

            throw new Error("Please provide signing key or wallet");

          case 11:
            if (!(weiAmount === null || weiAmount === '')) {
              _context.next = 13;
              break;
            }

            throw new Error('Please provide amount of eth to claim');

          case 13:
            if (!(tokenAddress === null || tokenAddress === '')) {
              _context.next = 15;
              break;
            }

            throw new Error('Please provide ERC20 token address');

          case 15:
            if (!(tokenAmount === null || tokenAmount === '')) {
              _context.next = 17;
              break;
            }

            throw new Error('Please provide amount of tokens to claim');

          case 17:
            if (!(expirationTime === null || expirationTime === '')) {
              _context.next = 19;
              break;
            }

            throw new Error('Please provide expiration time');

          case 19:
            if (!(version === null || version === '')) {
              _context.next = 21;
              break;
            }

            throw new Error('Please provide contract version');

          case 21:
            if (!(campaignId === null || campaignId === '')) {
              _context.next = 23;
              break;
            }

            throw new Error('Please provide campaign id');

          case 23:
            if (typeof signingKeyOrWallet === 'string') {
              linkdropSigner = new ethers.Wallet(signingKeyOrWallet);
            } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
              linkdropSigner = signingKeyOrWallet;
            }

            proxyAddress = (0, _utils.computeProxyAddress)(factoryAddress, linkdropMasterAddress, campaignId);
            _context.next = 27;
            return (0, _utils.createLink)({
              linkdropSigner: linkdropSigner,
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              version: version,
              chainId: chainId,
              proxyAddress: proxyAddress
            });

          case 27:
            _ref3 = _context.sent;
            linkKey = _ref3.linkKey;
            linkId = _ref3.linkId;
            linkdropSignerSignature = _ref3.linkdropSignerSignature;
            // Construct link
            url = "".concat(claimHost, "/#/receive?weiAmount=").concat(weiAmount, "&tokenAddress=").concat(tokenAddress, "&tokenAmount=").concat(tokenAmount, "&expirationTime=").concat(expirationTime, "&version=").concat(version, "&chainId=").concat(chainId, "&linkKey=").concat(linkKey, "&linkdropMasterAddress=").concat(linkdropMasterAddress, "&linkdropSignerSignature=").concat(linkdropSignerSignature, "&campaignId=").concat(campaignId);
            return _context.abrupt("return", {
              url: url,
              linkId: linkId,
              linkKey: linkKey,
              linkdropSignerSignature: linkdropSignerSignature
            });

          case 33:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function generateLink(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.generateLink = generateLink;

var generateLinkERC721 =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref4) {
    var factoryAddress, chainId, claimHost, linkdropMasterAddress, signingKeyOrWallet, weiAmount, nftAddress, tokenId, expirationTime, version, campaignId, linkdropSigner, proxyAddress, _ref6, linkKey, linkId, linkdropSignerSignature, url;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            factoryAddress = _ref4.factoryAddress, chainId = _ref4.chainId, claimHost = _ref4.claimHost, linkdropMasterAddress = _ref4.linkdropMasterAddress, signingKeyOrWallet = _ref4.signingKeyOrWallet, weiAmount = _ref4.weiAmount, nftAddress = _ref4.nftAddress, tokenId = _ref4.tokenId, expirationTime = _ref4.expirationTime, version = _ref4.version, campaignId = _ref4.campaignId;

            if (!(factoryAddress === null || factoryAddress === '')) {
              _context2.next = 3;
              break;
            }

            throw new Error('Please provide factory address');

          case 3:
            if (!(chainId === null || chainId === '')) {
              _context2.next = 5;
              break;
            }

            throw new Error('Please provide chain id');

          case 5:
            if (!(claimHost === null || claimHost === '')) {
              _context2.next = 7;
              break;
            }

            throw new Error('Please provide claim host');

          case 7:
            if (!(linkdropMasterAddress === null || linkdropMasterAddress === '')) {
              _context2.next = 9;
              break;
            }

            throw new Error("Please provide linkdrop master's address");

          case 9:
            if (!(signingKeyOrWallet === null || signingKeyOrWallet === '')) {
              _context2.next = 11;
              break;
            }

            throw new Error("Please provide signing key or wallet");

          case 11:
            if (!(weiAmount === null || weiAmount === '')) {
              _context2.next = 13;
              break;
            }

            throw new Error('Please provide amount of eth to claim');

          case 13:
            if (!(nftAddress === null || nftAddress === '' || nftAddress === ethers.constants.AddressZero)) {
              _context2.next = 15;
              break;
            }

            throw new Error('Please provide ERC721 token address');

          case 15:
            if (!(tokenId === null || tokenId === '')) {
              _context2.next = 17;
              break;
            }

            throw new Error('Please provide token id to claim');

          case 17:
            if (!(expirationTime === null || expirationTime === '')) {
              _context2.next = 19;
              break;
            }

            throw new Error('Please provide expiration time');

          case 19:
            if (!(version === null || version === '')) {
              _context2.next = 21;
              break;
            }

            throw new Error('Please provide contract version');

          case 21:
            if (!(campaignId === null || campaignId === '')) {
              _context2.next = 23;
              break;
            }

            throw new Error('Please provide campaign id');

          case 23:
            if (typeof signingKeyOrWallet === 'string') {
              linkdropSigner = new ethers.Wallet(signingKeyOrWallet);
            } else if ((0, _typeof2["default"])(signingKeyOrWallet) === 'object') {
              linkdropSigner = signingKeyOrWallet;
            }

            proxyAddress = (0, _utils.computeProxyAddress)(factoryAddress, linkdropMasterAddress, campaignId);
            _context2.next = 27;
            return (0, _utils.createLinkERC721)({
              linkdropSigner: linkdropSigner,
              weiAmount: weiAmount,
              nftAddress: nftAddress,
              tokenId: tokenId,
              expirationTime: expirationTime,
              version: version,
              chainId: chainId,
              proxyAddress: proxyAddress
            });

          case 27:
            _ref6 = _context2.sent;
            linkKey = _ref6.linkKey;
            linkId = _ref6.linkId;
            linkdropSignerSignature = _ref6.linkdropSignerSignature;
            // Construct link
            url = "".concat(claimHost, "/#/receive?weiAmount=").concat(weiAmount, "&nftAddress=").concat(nftAddress, "&tokenId=").concat(tokenId, "&expirationTime=").concat(expirationTime, "&version=").concat(version, "&chainId=").concat(chainId, "&linkKey=").concat(linkKey, "&linkdropMasterAddress=").concat(linkdropMasterAddress, "&linkdropSignerSignature=").concat(linkdropSignerSignature, "&campaignId=").concat(campaignId);
            return _context2.abrupt("return", {
              url: url,
              linkId: linkId,
              linkKey: linkKey,
              linkdropSignerSignature: linkdropSignerSignature
            });

          case 33:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function generateLinkERC721(_x2) {
    return _ref5.apply(this, arguments);
  };
}();

exports.generateLinkERC721 = generateLinkERC721;