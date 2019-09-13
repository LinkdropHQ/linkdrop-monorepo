"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.claim = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _ethers = require("ethers");

var _utils = require("../utils");

var claim =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var jsonRpcUrl, apiHost, weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, receiverAddress, campaignId, provider, receiverSignature, linkId, claimParams, response, _response$data, error, errors, success, txHash;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref.jsonRpcUrl, apiHost = _ref.apiHost, weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, linkKey = _ref.linkKey, linkdropMasterAddress = _ref.linkdropMasterAddress, linkdropSignerSignature = _ref.linkdropSignerSignature, receiverAddress = _ref.receiverAddress, campaignId = _ref.campaignId;
            // Get provider
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl); // Get receiver signature

            _context.next = 4;
            return (0, _utils.signReceiverAddress)(linkKey, receiverAddress);

          case 4:
            receiverSignature = _context.sent;
            // Get linkId from linkKey
            linkId = new _ethers.ethers.Wallet(linkKey, provider).address;
            claimParams = {
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              linkId: linkId,
              linkdropMasterAddress: linkdropMasterAddress,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverAddress: receiverAddress,
              receiverSignature: receiverSignature,
              campaignId: campaignId
            };
            console.log('claimParams: ', claimParams);
            _context.next = 10;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes/claimAndCreate"), claimParams);

          case 10:
            response = _context.sent;
            _response$data = response.data, error = _response$data.error, errors = _response$data.errors, success = _response$data.success, txHash = _response$data.txHash;
            return _context.abrupt("return", {
              error: error,
              errors: errors,
              success: success,
              txHash: txHash
            });

          case 13:
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