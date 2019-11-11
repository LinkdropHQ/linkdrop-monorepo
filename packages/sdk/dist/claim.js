"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelLink = exports.getLinkStatus = exports.claim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _utils = require("./utils");

var _axios = _interopRequireDefault(require("axios"));

var _ethers = require("ethers");

_ethers.ethers.errors.setLogLevel('error');

var claim = function claim(_ref) {
  var jsonRpcUrl, apiHost, token, nft, feeToken, feeReceiver, linkKey, nativeTokensAmount, tokensAmount, tokenId, feeAmount, expiration, signerSignature, receiverAddress, linkdropContract, provider, receiverSignature, linkId, linkParams, response, _response$data, error, errors, success, txHash;

  return _regenerator["default"].async(function claim$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          jsonRpcUrl = _ref.jsonRpcUrl, apiHost = _ref.apiHost, token = _ref.token, nft = _ref.nft, feeToken = _ref.feeToken, feeReceiver = _ref.feeReceiver, linkKey = _ref.linkKey, nativeTokensAmount = _ref.nativeTokensAmount, tokensAmount = _ref.tokensAmount, tokenId = _ref.tokenId, feeAmount = _ref.feeAmount, expiration = _ref.expiration, signerSignature = _ref.signerSignature, receiverAddress = _ref.receiverAddress, linkdropContract = _ref.linkdropContract;

          if (!(jsonRpcUrl === null || jsonRpcUrl === '')) {
            _context.next = 3;
            break;
          }

          throw new Error('Please provide json rpc url');

        case 3:
          if (!(apiHost === null || apiHost === '')) {
            _context.next = 5;
            break;
          }

          throw new Error('Please provide api host');

        case 5:
          if (!(nativeTokensAmount === null || nativeTokensAmount === '')) {
            _context.next = 7;
            break;
          }

          throw new Error('Please provide native tokens amount to claim');

        case 7:
          if (!(token === null || token === '')) {
            _context.next = 9;
            break;
          }

          throw new Error('Please provide token address');

        case 9:
          if (!(nft === null || nft === '')) {
            _context.next = 11;
            break;
          }

          throw new Error('Please provide NFT address');

        case 11:
          if (!(feeToken === null || feeToken === '')) {
            _context.next = 13;
            break;
          }

          throw new Error('Please provide fee token address');

        case 13:
          if (!(feeReceiver === null || feeReceiver === '')) {
            _context.next = 15;
            break;
          }

          throw new Error('Please provide fee receiver address');

        case 15:
          if (!(linkKey === null || linkKey === '')) {
            _context.next = 17;
            break;
          }

          throw new Error('Please provide link key');

        case 17:
          if (!(nativeTokensAmount === null || nativeTokensAmount === '')) {
            _context.next = 19;
            break;
          }

          throw new Error('Please provide native tokens amount');

        case 19:
          if (!(tokensAmount === null || tokensAmount === '')) {
            _context.next = 21;
            break;
          }

          throw new Error('Please provide amount of tokens to claim');

        case 21:
          if (!(tokenId === null || tokenId === '')) {
            _context.next = 23;
            break;
          }

          throw new Error('Please provide NFT id');

        case 23:
          if (!(feeAmount === null || feeAmount === '')) {
            _context.next = 25;
            break;
          }

          throw new Error('Please provide fee amount');

        case 25:
          if (!(expiration == null || expiration === '')) {
            _context.next = 27;
            break;
          }

          throw new Error('Please provide link expiration timestamp');

        case 27:
          if (!(signerSignature === null || signerSignature === '')) {
            _context.next = 29;
            break;
          }

          throw new Error('Please provide linkdropMaster signature');

        case 29:
          if (!(receiverAddress === null || receiverAddress === '')) {
            _context.next = 31;
            break;
          }

          throw new Error('Please provide receiver address');

        case 31:
          if (!(linkdropContract === null || linkdropContract === '')) {
            _context.next = 33;
            break;
          }

          throw new Error('Please provide linkdrop contract address');

        case 33:
          // Get provider
          provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl); // Get receiver signature

          _context.next = 36;
          return _regenerator["default"].awrap((0, _utils.signReceiverAddress)(linkKey, receiverAddress));

        case 36:
          receiverSignature = _context.sent;
          // Get linkId from linkKey
          linkId = new _ethers.ethers.Wallet(linkKey, provider).address;
          linkParams = new _utils.LinkParams({
            token: token,
            nft: nft,
            feeToken: feeToken,
            feeReceiver: feeReceiver,
            linkId: linkId,
            nativeTokensAmount: nativeTokensAmount,
            tokensAmount: tokensAmount,
            tokenId: tokenId,
            feeAmount: feeAmount,
            expiration: expiration,
            signerSignature: signerSignature
          });
          _context.next = 41;
          return _regenerator["default"].awrap(_axios["default"].post("".concat(apiHost, "/api/v1/linkdrops/claim"), {
            linkParams: linkParams,
            receiverAddress: receiverAddress,
            receiverSignature: receiverSignature
          }));

        case 41:
          response = _context.sent;
          _response$data = response.data, error = _response$data.error, errors = _response$data.errors, success = _response$data.success, txHash = _response$data.txHash;
          return _context.abrupt("return", {
            error: error,
            errors: errors,
            success: success,
            txHash: txHash
          });

        case 44:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.claim = claim;

var getLinkStatus = function getLinkStatus(_ref2) {
  var apiHost, senderAddress, linkId, response;
  return _regenerator["default"].async(function getLinkStatus$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          apiHost = _ref2.apiHost, senderAddress = _ref2.senderAddress, linkId = _ref2.linkId;
          _context2.next = 3;
          return _regenerator["default"].awrap(_axios["default"].get("".concat(apiHost, "/api/v1/linkdrops/getStatus/").concat(senderAddress, "/").concat(linkId)));

        case 3:
          response = _context2.sent;
          return _context2.abrupt("return", response.data);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getLinkStatus = getLinkStatus;

var cancelLink = function cancelLink(_ref3) {
  var apiHost, senderAddress, linkId, response, _response$data2, error, errors, success, claimOperation;

  return _regenerator["default"].async(function cancelLink$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          apiHost = _ref3.apiHost, senderAddress = _ref3.senderAddress, linkId = _ref3.linkId;
          _context3.next = 3;
          return _regenerator["default"].awrap(_axios["default"].post("".concat(apiHost, "/api/v1/linkdrops/cancel"), {
            senderAddress: senderAddress,
            linkId: linkId
          }));

        case 3:
          response = _context3.sent;
          _response$data2 = response.data, error = _response$data2.error, errors = _response$data2.errors, success = _response$data2.success, claimOperation = _response$data2.claimOperation;
          return _context3.abrupt("return", {
            error: error,
            errors: errors,
            success: success,
            claimOperation: claimOperation
          });

        case 6:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.cancelLink = cancelLink;