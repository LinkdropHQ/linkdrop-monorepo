"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signTx = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethTypedData = _interopRequireDefault(require("eth-typed-data"));

var _ethSigUtil = _interopRequireDefault(require("eth-sig-util"));

var ethUtil = _interopRequireWildcard(require("ethereumjs-util"));

var _buffer = require("buffer");

var domain = new _ethTypedData["default"]({
  verifyingContract: '0x0000000000000000000000000000000000000000' // Address of smart contract associated with this domain

});
var SafeTx = domain.createType('SafeTx', [{
  type: 'address',
  name: 'to'
}, {
  type: 'uint256',
  name: 'value'
}, {
  type: 'bytes',
  name: 'data'
}, {
  type: 'uint8',
  name: 'operation'
}, {
  type: 'uint256',
  name: 'safeTxGas'
}, {
  type: 'uint256',
  name: 'baseGas'
}, {
  type: 'uint256',
  name: 'gasPrice'
}, {
  type: 'address',
  name: 'gasToken'
}, {
  type: 'address',
  name: 'refundReceiver'
}, {
  type: 'uint256',
  name: 'nonce'
}]);

var signTx =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var safe, privateKey, to, value, _ref$data, data, _ref$operation, operation, safeTxGas, baseGas, gasPrice, _ref$gasToken, gasToken, _ref$refundReceiver, refundReceiver, nonce, typedData, signature;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            safe = _ref.safe, privateKey = _ref.privateKey, to = _ref.to, value = _ref.value, _ref$data = _ref.data, data = _ref$data === void 0 ? '0x' : _ref$data, _ref$operation = _ref.operation, operation = _ref$operation === void 0 ? '0' : _ref$operation, safeTxGas = _ref.safeTxGas, baseGas = _ref.baseGas, gasPrice = _ref.gasPrice, _ref$gasToken = _ref.gasToken, gasToken = _ref$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref$gasToken, _ref$refundReceiver = _ref.refundReceiver, refundReceiver = _ref$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref$refundReceiver, nonce = _ref.nonce;

            if (safe) {
              _context.next = 3;
              break;
            }

            throw new Error('Safe address is required');

          case 3:
            if (privateKey) {
              _context.next = 5;
              break;
            }

            throw new Error('Private key is required');

          case 5:
            if (to) {
              _context.next = 7;
              break;
            }

            throw new Error('To is required');

          case 7:
            if (value) {
              _context.next = 9;
              break;
            }

            throw new Error('Value is required');

          case 9:
            if (safeTxGas) {
              _context.next = 11;
              break;
            }

            throw new Error('Safe tx gas is required');

          case 11:
            if (baseGas) {
              _context.next = 13;
              break;
            }

            throw new Error('Base gas is required');

          case 13:
            if (gasPrice) {
              _context.next = 15;
              break;
            }

            throw new Error('Gas price is required');

          case 15:
            if (nonce) {
              _context.next = 17;
              break;
            }

            throw new Error('Nonce is required');

          case 17:
            privateKey = _buffer.Buffer.from(privateKey, 'hex');
            typedData = new SafeTx({
              to: to,
              value: value,
              data: data,
              operation: operation,
              safeTxGas: safeTxGas,
              baseGas: baseGas,
              gasPrice: gasPrice,
              gasToken: gasToken,
              refundReceiver: refundReceiver,
              nonce: nonce
            }).toSignatureRequest();
            signature = ethUtil.ecsign(_ethSigUtil["default"].TypedDataUtils.sign(typedData), privateKey); // const signature = sigUtil.signTypedData(
            //   Buffer.from(signingKeyOrWallet, 'hex'),
            //   {
            //     data: typedData
            //   }
            // )

            console.log(signature);
            return _context.abrupt("return", signature);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function signTx(_x) {
    return _ref2.apply(this, arguments);
  };
}(); // signTx(
//   'EEDFA6C63D0B44CE6C511C7A9425A8668DFADFC8F47FF24647A92489D5A913CC',
//   '0x0000000000000000000000000000000000000000',
//   {
//     to: '0x0000000000000000000000000000000000000000',
//     value: '10000000000000000',
//     data: '0x',
//     operation: '0',
//     safeTxGas: '42671',
//     baseGas: '40660',
//     gasPrice: '10000000000',
//     gasToken: '0x0000000000000000000000000000000000000000',
//     refundReceiver: '0x0000000000000000000000000000000000000000',
//     nonce: 0
//   }
// )


exports.signTx = signTx;