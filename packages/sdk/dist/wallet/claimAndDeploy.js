"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.claimAndDeploy = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _utils = require("./utils");

var _ethers = require("ethers");

var _axios = _interopRequireDefault(require("axios"));

// Turn off annoying warnings
_ethers.ethers.errors.setLogLevel('error');

var claimAndDeploy =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var jsonRpcUrl, apiHost, weiAmount, tokenAddress, tokenAmount, expirationTime, version, chainId, linkKey, linkdropMasterAddress, linkdropSignerSignature, receiverAddress, factoryAddress, campaignId, walletFactory, publicKey, initializeWithENS, signature, provider, receiverSignature, linkId, claimAndDeployParams, response, _response$data, error, errors, success, txHash;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jsonRpcUrl = _ref.jsonRpcUrl, apiHost = _ref.apiHost, weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, version = _ref.version, chainId = _ref.chainId, linkKey = _ref.linkKey, linkdropMasterAddress = _ref.linkdropMasterAddress, linkdropSignerSignature = _ref.linkdropSignerSignature, receiverAddress = _ref.receiverAddress, factoryAddress = _ref.factoryAddress, campaignId = _ref.campaignId, walletFactory = _ref.walletFactory, publicKey = _ref.publicKey, initializeWithENS = _ref.initializeWithENS, signature = _ref.signature;

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
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl); // Get receiver signature

            _context.next = 32;
            return (0, _utils.signReceiverAddress)(linkKey, receiverAddress);

          case 32:
            receiverSignature = _context.sent;
            // Get linkId from linkKey
            linkId = new _ethers.ethers.Wallet(linkKey, provider).address;
            claimAndDeployParams = {
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
              campaignId: campaignId,
              walletFactory: walletFactory,
              publicKey: publicKey,
              initializeWithENS: initializeWithENS,
              signature: signature
            };
            _context.next = 37;
            return _axios["default"].post("".concat(apiHost, "/api/v1/linkdrops/deployAndClaim"), claimAndDeployParams);

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

  return function claimAndDeploy(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.claimAndDeploy = claimAndDeploy;