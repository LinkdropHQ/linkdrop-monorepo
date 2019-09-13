"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _sdk = require("@linkdrop/sdk");

var _ora = _interopRequireDefault(require("ora"));

var _ethers = require("ethers");

var _terminalKit = require("terminal-kit");

var _utils = require("./utils");

// import WalletSDK from './WalletSDK'
// import { ethers } from 'ethers'
// const main = async () => {
//   const sdk = new WalletSDK()
//   //   const response = await sdk.createSafe(
//   //     '0xa208969d8f9e443e2b497540d069a5d1a6878f4e'
//   //   )
//   //   console.log('response: ', response)
//   const privateKey = undefined
//   const safe = '0x563df37ff1e6a70d6d0af364a9ca95c31ea61c94'
//   const response = await sdk.executeTx({
//     safe,
//     privateKey,
//     to: '0x646F6381010bA304cA1f912d6E7BB9972b4b6f56',
//     value: 1234
//   })
//   console.log({ response })
// }
// main()
_ethers.ethers.errors.setLogLevel('error');

var JSON_RPC_URL = (0, _utils.getString)('jsonRpcUrl');
var CHAIN = (0, _utils.getString)('CHAIN');
var API_HOST = (0, _utils.getString)('API_HOST');
var RECEIVER_ADDRESS = (0, _utils.getString)('receiverAddress');
var FACTORY_ADDRESS = (0, _utils.getString)('FACTORY_ADDRESS');
var LINKS_NUMBER = (0, _utils.getString)('linksNumber');

var claim =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var spinner, linkNumber, _ref2, weiAmount, tokenAddress, tokenAmount, expirationTime, version, chainId, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, linkdropSDK, _ref3, errors, success, txHash;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            linkNumber = (0, _utils.getLinkNumber)(LINKS_NUMBER - 1);

            _terminalKit.terminal.bold("Claiming link #".concat(linkNumber, ":\n"));

            spinner = (0, _ora["default"])({
              text: _terminalKit.terminal.bold.green.str('Claiming\n'),
              color: 'green'
            });
            spinner.start();
            _context.next = 7;
            return (0, _utils.getUrlParams)('eth', linkNumber);

          case 7:
            _ref2 = _context.sent;
            weiAmount = _ref2.weiAmount;
            tokenAddress = _ref2.tokenAddress;
            tokenAmount = _ref2.tokenAmount;
            expirationTime = _ref2.expirationTime;
            version = _ref2.version;
            chainId = _ref2.chainId;
            linkKey = _ref2.linkKey;
            linkdropMasterAddress = _ref2.linkdropMasterAddress;
            linkdropSignerSignature = _ref2.linkdropSignerSignature;
            campaignId = _ref2.campaignId;
            linkdropSDK = (0, _sdk.LinkdropSDK)({
              linkdropMasterAddress: linkdropMasterAddress,
              chain: CHAIN,
              jsonRpcUrl: JSON_RPC_URL,
              apiHost: API_HOST,
              factoryAddress: FACTORY_ADDRESS
            });
            _context.next = 21;
            return linkdropSDK.claim({
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              version: version,
              chainId: chainId,
              linkKey: linkKey,
              linkdropMasterAddress: linkdropMasterAddress,
              linkdropSignerSignature: linkdropSignerSignature,
              receiverAddress: RECEIVER_ADDRESS,
              campaignId: campaignId
            });

          case 21:
            _ref3 = _context.sent;
            errors = _ref3.errors;
            success = _ref3.success;
            txHash = _ref3.txHash;

            if (success === true && txHash) {
              spinner.succeed(_terminalKit.terminal.bold.str('Submitted claim transaction'));

              _terminalKit.terminal.bold("Tx hash: ^g".concat(txHash, "\n"));
            }

            _context.next = 32;
            break;

          case 28:
            _context.prev = 28;
            _context.t0 = _context["catch"](0);
            spinner.fail(_terminalKit.terminal.bold.red.str('Failed to claim'));
            throw (0, _utils.newError)(_context.t0);

          case 32:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 28]]);
  }));

  return function claim() {
    return _ref.apply(this, arguments);
  };
}();

claim();