"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signTx = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ethSigUtil = _interopRequireDefault(require("eth-sig-util"));

var _buffer = require("buffer");

var _bignumber = _interopRequireDefault(require("bignumber.js"));

var getTypedData = function getTypedData(_ref) {
  var safe = _ref.safe,
      to = _ref.to,
      value = _ref.value,
      _ref$data = _ref.data,
      data = _ref$data === void 0 ? '0x' : _ref$data,
      _ref$operation = _ref.operation,
      operation = _ref$operation === void 0 ? '0' : _ref$operation,
      safeTxGas = _ref.safeTxGas,
      baseGas = _ref.baseGas,
      gasPrice = _ref.gasPrice,
      _ref$gasToken = _ref.gasToken,
      gasToken = _ref$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref$gasToken,
      _ref$refundReceiver = _ref.refundReceiver,
      refundReceiver = _ref$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref$refundReceiver,
      _ref$nonce = _ref.nonce,
      nonce = _ref$nonce === void 0 ? '0' : _ref$nonce;
  return {
    types: {
      EIP712Domain: [{
        type: 'address',
        name: 'verifyingContract'
      }],
      SafeTx: [{
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
      }]
    },
    domain: {
      verifyingContract: safe
    },
    primaryType: 'SafeTx',
    message: {
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
    }
  };
};

var signTx =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref2) {
    var safe, privateKey, to, value, _ref2$data, data, _ref2$operation, operation, safeTxGas, baseGas, gasPrice, _ref2$gasToken, gasToken, _ref2$refundReceiver, refundReceiver, nonce, typedData, signature;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            safe = _ref2.safe, privateKey = _ref2.privateKey, to = _ref2.to, value = _ref2.value, _ref2$data = _ref2.data, data = _ref2$data === void 0 ? '0x' : _ref2$data, _ref2$operation = _ref2.operation, operation = _ref2$operation === void 0 ? '0' : _ref2$operation, safeTxGas = _ref2.safeTxGas, baseGas = _ref2.baseGas, gasPrice = _ref2.gasPrice, _ref2$gasToken = _ref2.gasToken, gasToken = _ref2$gasToken === void 0 ? '0x0000000000000000000000000000000000000000' : _ref2$gasToken, _ref2$refundReceiver = _ref2.refundReceiver, refundReceiver = _ref2$refundReceiver === void 0 ? '0x0000000000000000000000000000000000000000' : _ref2$refundReceiver, nonce = _ref2.nonce;

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
            if (privateKey.includes('0x')) {
              privateKey = privateKey.replace('0x', '');
            }

            privateKey = _buffer.Buffer.from(privateKey, 'hex');
            typedData = getTypedData({
              safe: safe,
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
            });
            signature = _ethSigUtil["default"].signTypedData(privateKey, {
              data: typedData
            });
            return _context.abrupt("return", {
              r: new _bignumber["default"](signature.slice(2, 66), 16).toString(10),
              s: new _bignumber["default"](signature.slice(66, 130), 16).toString(10),
              v: new _bignumber["default"](signature.slice(130, 132), 16).toString(10)
            });

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function signTx(_x) {
    return _ref3.apply(this, arguments);
  };
}();

exports.signTx = signTx;