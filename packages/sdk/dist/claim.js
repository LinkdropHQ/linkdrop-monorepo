"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelLink = exports.getLinkStatus = exports.claimAndDeploy = exports.claim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("./utils");

var _axios = _interopRequireDefault(require("axios"));

var _ethers = require("ethers");

_ethers.ethers.errors.setLogLevel('error');

var claim =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var jsonRpcUrl, apiHost, token, nft, feeToken, feeReceiver, linkKey, nativeTokensAmount, tokensAmount, tokenId, feeAmount, expiration, data, signerSignature, receiverAddress, linkdropContract, provider, receiverSignature, linkId, linkParams, response, _response$data, error, errors, success, txHash;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref.jsonRpcUrl, apiHost = _ref.apiHost, token = _ref.token, nft = _ref.nft, feeToken = _ref.feeToken, feeReceiver = _ref.feeReceiver, linkKey = _ref.linkKey, nativeTokensAmount = _ref.nativeTokensAmount, tokensAmount = _ref.tokensAmount, tokenId = _ref.tokenId, feeAmount = _ref.feeAmount, expiration = _ref.expiration, data = _ref.data, signerSignature = _ref.signerSignature, receiverAddress = _ref.receiverAddress, linkdropContract = _ref.linkdropContract;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context.next = 3;
              break;
            }

            throw new Error('Please provide json rpc url');

          case 3:
            if (!(apiHost == null || apiHost === '')) {
              _context.next = 5;
              break;
            }

            throw new Error('Please provide api host');

          case 5:
            if (!(nativeTokensAmount == null || nativeTokensAmount === '')) {
              _context.next = 7;
              break;
            }

            throw new Error('Please provide native tokens amount to claim');

          case 7:
            if (!(token == null || token === '')) {
              _context.next = 9;
              break;
            }

            throw new Error('Please provide token address');

          case 9:
            if (!(nft == null || nft === '')) {
              _context.next = 11;
              break;
            }

            throw new Error('Please provide NFT address');

          case 11:
            if (!(feeToken == null || feeToken === '')) {
              _context.next = 13;
              break;
            }

            throw new Error('Please provide fee token address');

          case 13:
            if (!(feeReceiver == null || feeReceiver === '')) {
              _context.next = 15;
              break;
            }

            throw new Error('Please provide fee receiver address');

          case 15:
            if (!(linkKey == null || linkKey === '')) {
              _context.next = 17;
              break;
            }

            throw new Error('Please provide link key');

          case 17:
            if (!(nativeTokensAmount == null || nativeTokensAmount === '')) {
              _context.next = 19;
              break;
            }

            throw new Error('Please provide native tokens amount');

          case 19:
            if (!(tokensAmount == null || tokensAmount === '')) {
              _context.next = 21;
              break;
            }

            throw new Error('Please provide amount of tokens to claim');

          case 21:
            if (!(tokenId == null || tokenId === '')) {
              _context.next = 23;
              break;
            }

            throw new Error('Please provide NFT id');

          case 23:
            if (!(feeAmount == null || feeAmount === '')) {
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
            if (!(data == null || data === '')) {
              _context.next = 29;
              break;
            }

            throw new Error('Please provide callback data');

          case 29:
            if (!(signerSignature == null || signerSignature === '')) {
              _context.next = 31;
              break;
            }

            throw new Error('Please provide linkdropMaster signature');

          case 31:
            if (!(receiverAddress == null || receiverAddress === '')) {
              _context.next = 33;
              break;
            }

            throw new Error('Please provide receiver address');

          case 33:
            if (!(linkdropContract == null || linkdropContract === '')) {
              _context.next = 35;
              break;
            }

            throw new Error('Please provide linkdrop contract address');

          case 35:
            // Get provider
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl); // Get receiver signature

            _context.next = 38;
            return (0, _utils.signReceiverAddress)(linkKey, receiverAddress);

          case 38:
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
              data: data
            });
            _context.next = 43;
            return _axios["default"].post("".concat(apiHost, "/api/v1/linkdrops/claim"), {
              linkParams: linkParams,
              signerSignature: signerSignature,
              receiverAddress: receiverAddress,
              receiverSignature: receiverSignature,
              linkdropContractAddress: linkdropContract
            });

          case 43:
            response = _context.sent;
            _response$data = response.data, error = _response$data.error, errors = _response$data.errors, success = _response$data.success, txHash = _response$data.txHash;
            return _context.abrupt("return", {
              error: error,
              errors: errors,
              success: success,
              txHash: txHash
            });

          case 46:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function claim(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.claim = claim;

var claimAndDeploy =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var jsonRpcUrl, apiHost, token, nft, feeToken, feeReceiver, linkKey, nativeTokensAmount, tokensAmount, tokenId, feeAmount, expiration, data, signerSignature, receiverAddress, linkdropContract, sender, factory, provider, receiverSignature, linkId, linkParams, response, _response$data2, error, errors, success, txHash;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            jsonRpcUrl = _ref3.jsonRpcUrl, apiHost = _ref3.apiHost, token = _ref3.token, nft = _ref3.nft, feeToken = _ref3.feeToken, feeReceiver = _ref3.feeReceiver, linkKey = _ref3.linkKey, nativeTokensAmount = _ref3.nativeTokensAmount, tokensAmount = _ref3.tokensAmount, tokenId = _ref3.tokenId, feeAmount = _ref3.feeAmount, expiration = _ref3.expiration, data = _ref3.data, signerSignature = _ref3.signerSignature, receiverAddress = _ref3.receiverAddress, linkdropContract = _ref3.linkdropContract, sender = _ref3.sender, factory = _ref3.factory;

            if (!(jsonRpcUrl == null || jsonRpcUrl === '')) {
              _context2.next = 3;
              break;
            }

            throw new Error('Please provide json rpc url');

          case 3:
            if (!(apiHost == null || apiHost === '')) {
              _context2.next = 5;
              break;
            }

            throw new Error('Please provide api host');

          case 5:
            if (!(nativeTokensAmount == null || nativeTokensAmount === '')) {
              _context2.next = 7;
              break;
            }

            throw new Error('Please provide native tokens amount to claim');

          case 7:
            if (!(token == null || token === '')) {
              _context2.next = 9;
              break;
            }

            throw new Error('Please provide token address');

          case 9:
            if (!(nft == null || nft === '')) {
              _context2.next = 11;
              break;
            }

            throw new Error('Please provide NFT address');

          case 11:
            if (!(feeToken == null || feeToken === '')) {
              _context2.next = 13;
              break;
            }

            throw new Error('Please provide fee token address');

          case 13:
            if (!(feeReceiver == null || feeReceiver === '')) {
              _context2.next = 15;
              break;
            }

            throw new Error('Please provide fee receiver address');

          case 15:
            if (!(linkKey == null || linkKey === '')) {
              _context2.next = 17;
              break;
            }

            throw new Error('Please provide link key');

          case 17:
            if (!(nativeTokensAmount == null || nativeTokensAmount === '')) {
              _context2.next = 19;
              break;
            }

            throw new Error('Please provide native tokens amount');

          case 19:
            if (!(tokensAmount == null || tokensAmount === '')) {
              _context2.next = 21;
              break;
            }

            throw new Error('Please provide amount of tokens to claim');

          case 21:
            if (!(tokenId == null || tokenId === '')) {
              _context2.next = 23;
              break;
            }

            throw new Error('Please provide NFT id');

          case 23:
            if (!(feeAmount == null || feeAmount === '')) {
              _context2.next = 25;
              break;
            }

            throw new Error('Please provide fee amount');

          case 25:
            if (!(expiration == null || expiration === '')) {
              _context2.next = 27;
              break;
            }

            throw new Error('Please provide link expiration timestamp');

          case 27:
            if (!(data == null || data === '')) {
              _context2.next = 29;
              break;
            }

            throw new Error('Please provide link callback data');

          case 29:
            if (!(signerSignature == null || signerSignature === '')) {
              _context2.next = 31;
              break;
            }

            throw new Error('Please provide linkdropMaster signature');

          case 31:
            if (!(receiverAddress == null || receiverAddress === '')) {
              _context2.next = 33;
              break;
            }

            throw new Error('Please provide receiver address');

          case 33:
            if (!(linkdropContract == null || linkdropContract === '')) {
              _context2.next = 35;
              break;
            }

            throw new Error('Please provide linkdrop contract address');

          case 35:
            if (!(sender == null || sender === '')) {
              _context2.next = 37;
              break;
            }

            throw new Error('Please provide sender address');

          case 37:
            if (!(factory == null || factory === '')) {
              _context2.next = 39;
              break;
            }

            throw new Error('Please provide factory address');

          case 39:
            // Get provider
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl); // Get receiver signature

            _context2.next = 42;
            return (0, _utils.signReceiverAddress)(linkKey, receiverAddress);

          case 42:
            receiverSignature = _context2.sent;
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
              data: data
            });
            _context2.next = 47;
            return _axios["default"].post("".concat(apiHost, "/api/v1/linkdrops/claimAndDeploy"), {
              linkParams: linkParams,
              signerSignature: signerSignature,
              receiverAddress: receiverAddress,
              receiverSignature: receiverSignature,
              linkdropContractAddress: linkdropContract,
              senderAddress: sender,
              factoryAddress: factory
            });

          case 47:
            response = _context2.sent;
            _response$data2 = response.data, error = _response$data2.error, errors = _response$data2.errors, success = _response$data2.success, txHash = _response$data2.txHash;
            return _context2.abrupt("return", {
              error: error,
              errors: errors,
              success: success,
              txHash: txHash
            });

          case 50:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function claimAndDeploy(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.claimAndDeploy = claimAndDeploy;

var getLinkStatus =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(_ref5) {
    var apiHost, linkdropContractAddress, linkId, response;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            apiHost = _ref5.apiHost, linkdropContractAddress = _ref5.linkdropContractAddress, linkId = _ref5.linkId;
            _context3.next = 3;
            return _axios["default"].get("".concat(apiHost, "/api/v1/linkdrops/getStatus/").concat(linkdropContractAddress, "/").concat(linkId));

          case 3:
            response = _context3.sent;
            return _context3.abrupt("return", response.data);

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getLinkStatus(_x3) {
    return _ref6.apply(this, arguments);
  };
}();

exports.getLinkStatus = getLinkStatus;

var cancelLink =
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(_ref7) {
    var apiHost, linkdropContractAddress, linkId, response, _response$data3, error, errors, success, claimOperation;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            apiHost = _ref7.apiHost, linkdropContractAddress = _ref7.linkdropContractAddress, linkId = _ref7.linkId;
            _context4.next = 3;
            return _axios["default"].post("".concat(apiHost, "/api/v1/linkdrops/cancel"), {
              linkdropContractAddress: linkdropContractAddress,
              linkId: linkId
            });

          case 3:
            response = _context4.sent;
            _response$data3 = response.data, error = _response$data3.error, errors = _response$data3.errors, success = _response$data3.success, claimOperation = _response$data3.claimOperation;
            return _context4.abrupt("return", {
              error: error,
              errors: errors,
              success: success,
              claimOperation: claimOperation
            });

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function cancelLink(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

exports.cancelLink = cancelLink;