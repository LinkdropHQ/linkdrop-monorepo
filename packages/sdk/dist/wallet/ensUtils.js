"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEnsOwner = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ens = require("@ensdomains/ens");

var _ethers = require("ethers");

var _assertJs = _interopRequireDefault(require("assert-js"));

/**
 * Function to get owner of ENS identifier
 * @param {String} name ENS identifier (e.g 'alice.eth')
 * @param {String} chain Chain identifier
 * @param {String} jsonRpcUrl JSON RPC URL
 * @return {String} ENS identifier owner's address
 */
var getEnsOwner =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var name, chain, jsonRpcUrl, ensAddress, provider, ensContract, node;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _ref.name, chain = _ref.chain, jsonRpcUrl = _ref.jsonRpcUrl;

            _assertJs["default"].string(name, 'Name is required');

            _assertJs["default"].string(chain, 'Chain is required');

            _assertJs["default"].url(jsonRpcUrl, 'Json rpc url is required');

            ensAddress = getEnsAddress(chain);
            provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
            ensContract = new _ethers.ethers.Contract(ensAddress, _ens.ENS.abi, provider);
            node = _ethers.ethers.utils.namehash(name);
            return _context.abrupt("return", ensContract.owner(node));

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getEnsOwner(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.getEnsOwner = getEnsOwner;

var getEnsAddress = function getEnsAddress(chain) {
  _assertJs["default"].string(chain, 'Chain is required');

  switch (chain) {
    case 'mainnet':
      return '0x314159265dd8dbb310642f98f50c066173c1259b';

    case 'rinkeby':
      return '0xe7410170f87102df0055eb195163a03b7f2bff4a';

    case 'ropsten':
      return '0x112234455c3a32fd11230c42e7bccd4a84e02010';

    case 'goerli':
      return '0x112234455c3a32fd11230c42e7bccd4a84e02010';

    default:
      throw new Error('Unsupported chain');
  }
};