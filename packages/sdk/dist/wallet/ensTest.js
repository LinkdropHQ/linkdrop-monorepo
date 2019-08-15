"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethers = require("ethers");

var _ens = require("@ensdomains/ens");

// const ensAddr = '0xe7410170f87102df0055eb195163a03b7f2bff4a'
var ensAddr = '0x112234455c3a32fd11230c42e7bccd4a84e02010'; // ropsten

var provider = new _ethers.ethers.providers.JsonRpcProvider('https://ropsten.infura.io');
var ensContract = new _ethers.ethers.Contract(ensAddr, _ens.ENS.abi, provider);

var main =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var nameHash, owner, resolver, reverseResolver, reverseNode, reverseRegistrarAddr, reverseRegistrarContract, def;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nameHash = _ethers.ethers.utils.namehash('mikhail.my-login.test');
            console.log('nameHash: ', nameHash);
            _context.next = 4;
            return ensContract.owner(nameHash);

          case 4:
            owner = _context.sent;
            console.log('owner: ', owner);
            _context.next = 8;
            return ensContract.resolver(nameHash);

          case 8:
            resolver = _context.sent;
            console.log('resolver: ', resolver);
            _context.next = 12;
            return ensContract.resolver(_ethers.ethers.utils.namehash("".concat(owner.slice(2), ".addr.reverse")));

          case 12:
            reverseResolver = _context.sent;
            console.log('reverseResolver: ', reverseResolver);
            reverseNode = '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';
            _context.next = 17;
            return ensContract.owner(reverseNode);

          case 17:
            reverseRegistrarAddr = _context.sent;
            console.log('reverseRegistrarAddr: ', reverseRegistrarAddr);
            reverseRegistrarContract = new _ethers.ethers.Contract(reverseRegistrarAddr, _ens.ReverseRegistrar.abi, provider);
            _context.next = 22;
            return reverseRegistrarContract.defaultResolver();

          case 22:
            def = _context.sent;
            console.log('def: ', def);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function main() {
    return _ref.apply(this, arguments);
  };
}();

main();