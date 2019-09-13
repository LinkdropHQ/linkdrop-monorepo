"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.claimAndCreate = exports.create = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _axios = _interopRequireDefault(require("axios"));

var _assertJs = _interopRequireDefault(require("assert-js"));

var _computeSafeAddress = require("./computeSafeAddress");

var _utils = require("../utils");

var _ethers = require("ethers");

/**
 * Function to create new safe
 * @param {String} owner Safe owner's address
 * @param {String} name ENS name to register for safe
 * @param {String} apiHost API host
 * @returns {Object} {success, txHash, safe, errors}
 */
var create =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var owner, name, apiHost, saltNonce, response, _response$data, success, txHash, safe, errors;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            owner = _ref.owner, name = _ref.name, apiHost = _ref.apiHost;

            _assertJs["default"].string(owner, 'Owner is required');

            _assertJs["default"].string(name, 'Name is required');

            saltNonce = new Date().getTime();
            _context.next = 6;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes"), {
              owner: owner,
              name: name,
              saltNonce: saltNonce
            });

          case 6:
            response = _context.sent;
            _response$data = response.data, success = _response$data.success, txHash = _response$data.txHash, safe = _response$data.safe, errors = _response$data.errors;
            return _context.abrupt("return", {
              success: success,
              txHash: txHash,
              safe: safe,
              errors: errors
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function create(_x) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Function to create new safe and claim linkdrop
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {String} tokenAmount Token amount
 * @param {String} expirationTime Link expiration timestamp
 * @param {String} linkKey Ephemeral key assigned to link
 * @param {String} linkdropMasterAddress Linkdrop master address
 * @param {String} linkdropSignerSignature Linkdrop signer signature
 * @param {String} campaignId Campaign id
 * @param {String} gnosisSafeMasterCopy Deployed gnosis safe mastercopy address
 * @param {String} proxyFactory Deployed proxy factory address
 * @param {String} owner Safe owner address
 * @param {String} name ENS name to register for safe
 * @param {String} apiHost API host
 * @returns {Object} {success, txHash, safe, errors}
 */


exports.create = create;

var claimAndCreate =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, gnosisSafeMasterCopy, proxyFactory, owner, name, apiHost, saltNonce, safe, receiverSignature, linkId, response, _response$data2, success, txHash, errors;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            weiAmount = _ref3.weiAmount, tokenAddress = _ref3.tokenAddress, tokenAmount = _ref3.tokenAmount, expirationTime = _ref3.expirationTime, linkKey = _ref3.linkKey, linkdropMasterAddress = _ref3.linkdropMasterAddress, linkdropSignerSignature = _ref3.linkdropSignerSignature, campaignId = _ref3.campaignId, gnosisSafeMasterCopy = _ref3.gnosisSafeMasterCopy, proxyFactory = _ref3.proxyFactory, owner = _ref3.owner, name = _ref3.name, apiHost = _ref3.apiHost;

            _assertJs["default"].string(weiAmount, 'Wei amount is required');

            _assertJs["default"].string(tokenAddress, 'Token address is required');

            _assertJs["default"].string(tokenAmount, 'Token amount is required');

            _assertJs["default"].string(expirationTime, 'Expiration time is required');

            _assertJs["default"].string(linkKey, 'Link key is required');

            _assertJs["default"].string(linkdropMasterAddress, 'Linkdrop master address is requred');

            _assertJs["default"].string(linkdropSignerSignature, 'Linkdrop signer signature is required');

            _assertJs["default"].string(campaignId, 'Campaign id is required');

            _assertJs["default"].string(gnosisSafeMasterCopy, 'Gnosis safe mastercopy address is required');

            _assertJs["default"].string(proxyFactory, 'Proxy factory address is required');

            _assertJs["default"].string(owner, 'Owner is required');

            _assertJs["default"].string(name, 'Name is required');

            _assertJs["default"].string(apiHost, 'Api host is required');

            saltNonce = new Date().getTime();
            safe = (0, _computeSafeAddress.computeSafeAddress)({
              owner: owner,
              saltNonce: saltNonce,
              gnosisSafeMasterCopy: gnosisSafeMasterCopy,
              proxyFactory: proxyFactory
            });
            _context2.next = 18;
            return (0, _utils.signReceiverAddress)(linkKey, safe);

          case 18:
            receiverSignature = _context2.sent;
            linkId = new _ethers.ethers.Wallet(linkKey).address;
            _context2.next = 22;
            return _axios["default"].post("".concat(apiHost, "/api/v1/safes/claimAndCreate"), {
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              linkId: linkId,
              linkdropMasterAddress: linkdropMasterAddress,
              campaignId: campaignId,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverAddress: safe,
              receiverSignature: receiverSignature,
              owner: owner,
              name: name,
              saltNonce: saltNonce
            });

          case 22:
            response = _context2.sent;
            _response$data2 = response.data, success = _response$data2.success, txHash = _response$data2.txHash, errors = _response$data2.errors;
            return _context2.abrupt("return", {
              success: success,
              txHash: txHash,
              safe: safe,
              errors: errors
            });

          case 25:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function claimAndCreate(_x2) {
    return _ref4.apply(this, arguments);
  };
}();

exports.claimAndCreate = claimAndCreate;