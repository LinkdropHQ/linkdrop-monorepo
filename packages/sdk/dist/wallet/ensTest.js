"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethers = require("ethers");

var _ens = require("@ensdomains/ens");

// registrar.register(_hashLabel, address(this));
// ens.setResolver(_node, address(resolver));
// resolver.setAddr(_node, address(this));
// ReverseRegistrar reverseRegistrar = ReverseRegistrar(ens.owner(ADDR_REVERSE_NODE));
// reverseRegistrar.setName(_name);
// const ADDR_REVERSE_NODE =
//   '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2'
// const registrar = ''
// const registry = '' // ENS
// const resolver = ''
var ensAddr = '0xe7410170f87102df0055eb195163a03b7f2bff4a'; // rinkeby
// const ensAddr = '0x112234455c3a32fd11230c42e7bccd4a84e02010' // ropsten
// const ensAddr = '0x314159265dd8dbb310642f98f50c066173c1259b' // mainnet

var provider = new _ethers.ethers.providers.JsonRpcProvider('https://rinkeby.infura.io');
var wallet = new _ethers.ethers.Wallet('', provider);

var main =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    var ensContract, node, registrarAddr, registrarContract, hex, label, tx;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            ensContract = new _ethers.ethers.Contract(ensAddr, _ens.ENS.abi, wallet);
            node = _ethers.ethers.utils.namehash('linkdrop.test');
            _context.next = 4;
            return ensContract.owner(node);

          case 4:
            registrarAddr = _context.sent;
            console.log('registrarAddr: ', registrarAddr);
            registrarContract = new _ethers.ethers.Contract(registrarAddr, _ens.FIFSRegistrar.abi, wallet);
            console.log('node: ', node);
            hex = _ethers.ethers.utils.toUtf8Bytes('amir');
            label = _ethers.ethers.utils.keccak256(hex);
            console.log('label: ', label);
            _context.next = 13;
            return registrarContract.register(label, '0xA208969D8F9E443E2B497540d069a5d1a6878f4E', {
              gasPrice: _ethers.ethers.utils.parseUnits('20', 'gwei')
            });

          case 13:
            tx = _context.sent;
            console.log('tx: ', tx.hash);

          case 15:
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