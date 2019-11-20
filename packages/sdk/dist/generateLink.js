"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateLink = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _utils = require("./utils");

var _ethers = require("ethers");

_ethers.ethers.errors.setLogLevel('error');

var generateLink = function generateLink(_ref) {
  var claimHost, factory, sender, campaignId, token, nft, feeToken, feeReceiver, nativeTokensAmount, tokensAmount, tokenId, feeAmount, expiration, version, chainId, signingKeyOrWallet, linkdropContract, _ref2, linkKey, linkId, linkParams, signerSignature, url;

  return _regenerator["default"].async(function generateLink$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          claimHost = _ref.claimHost, factory = _ref.factory, sender = _ref.sender, campaignId = _ref.campaignId, token = _ref.token, nft = _ref.nft, feeToken = _ref.feeToken, feeReceiver = _ref.feeReceiver, nativeTokensAmount = _ref.nativeTokensAmount, tokensAmount = _ref.tokensAmount, tokenId = _ref.tokenId, feeAmount = _ref.feeAmount, expiration = _ref.expiration, version = _ref.version, chainId = _ref.chainId, signingKeyOrWallet = _ref.signingKeyOrWallet;

          if (!(claimHost == null || claimHost === '')) {
            _context.next = 3;
            break;
          }

          throw new Error('Please provide claim host');

        case 3:
          if (!(factory == null || factory === '')) {
            _context.next = 5;
            break;
          }

          throw new Error('Please provide factory address');

        case 5:
          if (!(sender == null || sender === '')) {
            _context.next = 7;
            break;
          }

          throw new Error('Please provide sender address');

        case 7:
          if (!(campaignId == null || campaignId === '')) {
            _context.next = 9;
            break;
          }

          throw new Error('Please provide campaign id');

        case 9:
          linkdropContract = (0, _utils.computeProxyAddress)(factory, sender, campaignId);
          _context.next = 12;
          return _regenerator["default"].awrap((0, _utils.createLink)({
            token: token,
            nft: nft,
            feeToken: feeToken,
            feeReceiver: feeReceiver,
            nativeTokensAmount: nativeTokensAmount,
            tokensAmount: tokensAmount,
            tokenId: tokenId,
            feeAmount: feeAmount,
            expiration: expiration,
            version: version,
            chainId: chainId,
            linkdropContract: linkdropContract,
            signingKeyOrWallet: signingKeyOrWallet
          }));

        case 12:
          _ref2 = _context.sent;
          linkKey = _ref2.linkKey;
          linkId = _ref2.linkId;
          linkParams = _ref2.linkParams;
          signerSignature = _ref2.signerSignature;
          // Construct url
          url = "".concat(claimHost, "/#/receive?token=").concat(token, "&nft=").concat(nft, "&feeToken=").concat(feeToken, "&feeReceiver=").concat(feeReceiver, "&linkKey=").concat(linkKey, "&nativeTokensAmount=").concat(nativeTokensAmount, "&tokensAmount=").concat(tokensAmount, "&tokenId=").concat(tokenId, "&feeAmount=").concat(feeAmount, "&expiration=").concat(expiration, "&signerSignature=").concat(signerSignature, "&linkdropContract=").concat(linkdropContract, "&sender=").concat(sender);

          if (String(chainId) !== '1') {
            url = "".concat(url, "&chainId=").concat(chainId);
          }

          return _context.abrupt("return", {
            url: url,
            linkId: linkId,
            linkKey: linkKey,
            linkParams: linkParams,
            signerSignature: signerSignature
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.generateLink = generateLink;