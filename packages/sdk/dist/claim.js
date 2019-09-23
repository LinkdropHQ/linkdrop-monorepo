"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelLink = exports.getLinkStatus = exports.claimERC721 = exports.claim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("./utils");

var ethers = require('ethers');

var axios = require('axios'); // Turn off annoying warnings


ethers.errors.setLogLevel('error');

var claim =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var jsonRpcUrl, apiHost, weiAmount, tokenAddress, tokenAmount, expirationTime, version, chainId, linkKey, linkdropMasterAddress, linkdropSignerSignature, receiverAddress, factoryAddress, campaignId, provider, receiverSignature, linkId, claimParams, response, _response$data, error, errors, success, txHash;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref.jsonRpcUrl, apiHost = _ref.apiHost, weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, version = _ref.version, chainId = _ref.chainId, linkKey = _ref.linkKey, linkdropMasterAddress = _ref.linkdropMasterAddress, linkdropSignerSignature = _ref.linkdropSignerSignature, receiverAddress = _ref.receiverAddress, factoryAddress = _ref.factoryAddress, campaignId = _ref.campaignId;

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
            if (!(weiAmount === null || weiAmount === '')) {
              _context.next = 7;
              break;
            }

            throw new Error('Please provide amount of eth to claim');

          case 7:
            if (!(tokenAddress === null || tokenAddress === '')) {
              _context.next = 9;
              break;
            }

            throw new Error('Please provide ERC20 token address');

          case 9:
            if (!(tokenAmount === null || tokenAmount === '')) {
              _context.next = 11;
              break;
            }

            throw new Error('Please provide amount of tokens to claim');

          case 11:
            if (!(expirationTime === null || expirationTime === '')) {
              _context.next = 13;
              break;
            }

            throw new Error('Please provide expiration time');

          case 13:
            if (!(version === null || version === '')) {
              _context.next = 15;
              break;
            }

            throw new Error('Please provide mastercopy version ');

          case 15:
            if (!(chainId === null || chainId === '')) {
              _context.next = 17;
              break;
            }

            throw new Error('Please provide chain id');

          case 17:
            if (!(linkKey === null || linkKey === '')) {
              _context.next = 19;
              break;
            }

            throw new Error('Please provide link key');

          case 19:
            if (!(linkdropMasterAddress === null || linkdropMasterAddress === '')) {
              _context.next = 21;
              break;
            }

            throw new Error('Please provide linkdropMaster address');

          case 21:
            if (!(linkdropSignerSignature === null || linkdropSignerSignature === '')) {
              _context.next = 23;
              break;
            }

            throw new Error('Please provide linkdropMaster signature');

          case 23:
            if (!(receiverAddress === null || receiverAddress === '')) {
              _context.next = 25;
              break;
            }

            throw new Error('Please provide receiver address');

          case 25:
            if (!(campaignId === null || campaignId === '')) {
              _context.next = 27;
              break;
            }

            throw new Error('Please provide campaign id');

          case 27:
            if (!(factoryAddress === null || factoryAddress === '')) {
              _context.next = 29;
              break;
            }

            throw new Error('Please provide factory address');

          case 29:
            // Get provider
            provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl); // Get receiver signature

            _context.next = 32;
            return (0, _utils.signReceiverAddress)(linkKey, receiverAddress);

          case 32:
            receiverSignature = _context.sent;
            // Get linkId from linkKey
            linkId = new ethers.Wallet(linkKey, provider).address;
            claimParams = {
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              version: version,
              chainId: chainId,
              linkId: linkId,
              linkdropMasterAddress: linkdropMasterAddress,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverAddress: receiverAddress,
              receiverSignature: receiverSignature,
              factoryAddress: factoryAddress,
              campaignId: campaignId
            };
            _context.next = 37;
            return axios.post("".concat(apiHost, "/api/v1/linkdrops/claim"), claimParams);

          case 37:
            response = _context.sent;
            _response$data = response.data, error = _response$data.error, errors = _response$data.errors, success = _response$data.success, txHash = _response$data.txHash;
            return _context.abrupt("return", {
              error: error,
              errors: errors,
              success: success,
              txHash: txHash
            });

          case 40:
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

var claimERC721 =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var jsonRpcUrl, apiHost, weiAmount, nftAddress, tokenId, expirationTime, version, chainId, linkKey, linkdropMasterAddress, linkdropSignerSignature, receiverAddress, factoryAddress, campaignId, provider, receiverSignature, linkId, claimParams, response, _response$data2, error, errors, success, txHash;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            jsonRpcUrl = _ref3.jsonRpcUrl, apiHost = _ref3.apiHost, weiAmount = _ref3.weiAmount, nftAddress = _ref3.nftAddress, tokenId = _ref3.tokenId, expirationTime = _ref3.expirationTime, version = _ref3.version, chainId = _ref3.chainId, linkKey = _ref3.linkKey, linkdropMasterAddress = _ref3.linkdropMasterAddress, linkdropSignerSignature = _ref3.linkdropSignerSignature, receiverAddress = _ref3.receiverAddress, factoryAddress = _ref3.factoryAddress, campaignId = _ref3.campaignId;

            if (!(jsonRpcUrl === null || jsonRpcUrl === '')) {
              _context2.next = 3;
              break;
            }

            throw new Error('Please provide json rpc url');

          case 3:
            if (!(apiHost === null || apiHost === '')) {
              _context2.next = 5;
              break;
            }

            throw new Error('Please provide api host');

          case 5:
            if (!(weiAmount === null || weiAmount === '')) {
              _context2.next = 7;
              break;
            }

            throw new Error('Please provide amount of eth to claim');

          case 7:
            if (!(nftAddress === null || nftAddress === '' || nftAddress === ethers.constants.AddressZero)) {
              _context2.next = 9;
              break;
            }

            throw new Error('Please provide ERC721 token address');

          case 9:
            if (!(tokenId === null || tokenId === '')) {
              _context2.next = 11;
              break;
            }

            throw new Error('Please provide token id to claim');

          case 11:
            if (!(expirationTime === null || expirationTime === '')) {
              _context2.next = 13;
              break;
            }

            throw new Error('Please provide expiration time');

          case 13:
            if (!(version === null || version === '')) {
              _context2.next = 15;
              break;
            }

            throw new Error('Please provide mastercopy version ');

          case 15:
            if (!(chainId === null || chainId === '')) {
              _context2.next = 17;
              break;
            }

            throw new Error('Please provide chain id');

          case 17:
            if (!(linkKey === null || linkKey === '')) {
              _context2.next = 19;
              break;
            }

            throw new Error('Please provide link key');

          case 19:
            if (!(linkdropMasterAddress === null || linkdropMasterAddress === '')) {
              _context2.next = 21;
              break;
            }

            throw new Error('Please provide linkdropMaster address');

          case 21:
            if (!(linkdropSignerSignature === null || linkdropSignerSignature === '')) {
              _context2.next = 23;
              break;
            }

            throw new Error('Please provide linkdropMaster signature');

          case 23:
            if (!(receiverAddress === null || receiverAddress === '')) {
              _context2.next = 25;
              break;
            }

            throw new Error('Please provide receiver address');

          case 25:
            if (!(campaignId === null || campaignId === '')) {
              _context2.next = 27;
              break;
            }

            throw new Error('Please provide campaign id');

          case 27:
            if (!(factoryAddress === null || factoryAddress === '')) {
              _context2.next = 29;
              break;
            }

            throw new Error('Please provide factory address');

          case 29:
            // Get provider
            provider = new ethers.providers.JsonRpcProvider(jsonRpcUrl); // Get receiver signature

            _context2.next = 32;
            return (0, _utils.signReceiverAddress)(linkKey, receiverAddress);

          case 32:
            receiverSignature = _context2.sent;
            // Get linkId from linkKey
            linkId = new ethers.Wallet(linkKey, provider).address;
            claimParams = {
              weiAmount: weiAmount,
              nftAddress: nftAddress,
              tokenId: tokenId,
              expirationTime: expirationTime,
              version: version,
              chainId: chainId,
              linkId: linkId,
              linkdropMasterAddress: linkdropMasterAddress,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverAddress: receiverAddress,
              receiverSignature: receiverSignature,
              factoryAddress: factoryAddress,
              campaignId: campaignId
            };
            _context2.next = 37;
            return axios.post("".concat(apiHost, "/api/v1/linkdrops/claim-erc721"), claimParams);

          case 37:
            response = _context2.sent;
            _response$data2 = response.data, error = _response$data2.error, errors = _response$data2.errors, success = _response$data2.success, txHash = _response$data2.txHash;
            return _context2.abrupt("return", {
              error: error,
              errors: errors,
              success: success,
              txHash: txHash
            });

          case 40:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function claimERC721(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.claimERC721 = claimERC721;

var getLinkStatus =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(_ref5) {
    var apiHost, linkdropMasterAddress, linkId, response, _response$data3, error, errors, success, status;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            apiHost = _ref5.apiHost, linkdropMasterAddress = _ref5.linkdropMasterAddress, linkId = _ref5.linkId;
            _context3.next = 3;
            return axios.get("".concat(apiHost, "/api/v1/linkdrops/getStatus/").concat(linkdropMasterAddress, "/").concat(linkId));

          case 3:
            response = _context3.sent;
            _response$data3 = response.data, error = _response$data3.error, errors = _response$data3.errors, success = _response$data3.success, status = _response$data3.status;
            return _context3.abrupt("return", {
              error: error,
              errors: errors,
              success: success,
              status: status
            });

          case 6:
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
    var apiHost, linkdropMasterAddress, linkId, response, _response$data4, error, errors, success, claimOperation;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            apiHost = _ref7.apiHost, linkdropMasterAddress = _ref7.linkdropMasterAddress, linkId = _ref7.linkId;
            _context4.next = 3;
            return axios.post("".concat(apiHost, "/api/v1/linkdrops/cancel"), {
              linkdropMasterAddress: linkdropMasterAddress,
              linkId: linkId
            });

          case 3:
            response = _context4.sent;
            _response$data4 = response.data, error = _response$data4.error, errors = _response$data4.errors, success = _response$data4.success, claimOperation = _response$data4.claimOperation;
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