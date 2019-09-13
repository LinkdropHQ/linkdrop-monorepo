"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildCreate2Address = exports.getParamFromTxEvent = exports.encodeDataForMultiSend = exports.encodeParams = exports.getCreateAndAddModulesData = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _ethers = require("ethers");

var getCreateAndAddModulesData = function getCreateAndAddModulesData(dataArray) {
  var moduleDataWrapper = new _ethers.ethers.utils.Interface(['function setup(bytes data)']); // Remove method id (10) and position of data in payload (64)

  return dataArray.reduce(function (acc, data) {
    return acc + moduleDataWrapper.functions.setup.encode([data]).substr(74);
  }, '0x');
};
/**
 * @dev Function to get encoded params data from contract abi
 * @param {Object} abi Contract abi
 * @param {String} method Function name
 * @param {Array<T>} params Array of function params to be encoded
 * @return Encoded params data
 */


exports.getCreateAndAddModulesData = getCreateAndAddModulesData;

var encodeParams = function encodeParams(abi, method, params) {
  return new _ethers.ethers.utils.Interface(abi).functions[method].encode((0, _toConsumableArray2["default"])(params));
};
/**
 * Function to get encoded data to use in MultiSend library
 * @param {Number} operation
 * @param {String} to
 * @param {Number} value
 * @param {String} data
 */


exports.encodeParams = encodeParams;

var encodeDataForMultiSend = function encodeDataForMultiSend(operation, to, value, data) {
  var transactionWrapper = new _ethers.ethers.utils.Interface(['function send(uint8 operation, address to, uint256 value, bytes data)']);
  return transactionWrapper.functions.send.encode([operation, to, value, data]).substr(10);
};
/**
 * Function to get specific param from transaction event
 * @param {Object} tx Transaction object compatible with ethers.js library
 * @param {String} eventName Event name to parse param from
 * @param {String} paramName Parameter to be retrieved from event log
 * @param {Object} contract Contract instance compatible with ethers.js library
 * @return {String} Parameter parsed from transaction event
 */


exports.encodeDataForMultiSend = encodeDataForMultiSend;

var getParamFromTxEvent =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(tx, eventName, paramName, contract) {
    var provider, txReceipt, topic, logs, param;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            provider = contract.provider;
            _context.next = 3;
            return provider.getTransactionReceipt(tx.hash);

          case 3:
            txReceipt = _context.sent;
            topic = contract["interface"].events[eventName].topic;
            logs = txReceipt.logs;
            logs = logs.filter(function (l) {
              return l.address === contract.address && l.topics[0] === topic;
            });
            param = contract["interface"].events[eventName].decode(logs[0].data)[paramName];
            return _context.abrupt("return", param);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function getParamFromTxEvent(_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}();

exports.getParamFromTxEvent = getParamFromTxEvent;

var buildCreate2Address = function buildCreate2Address(creatorAddress, saltHex, byteCode) {
  var byteCodeHash = _ethers.ethers.utils.keccak256(byteCode);

  return "0x".concat(_ethers.ethers.utils.keccak256("0x".concat(['ff', creatorAddress, saltHex, byteCodeHash].map(function (x) {
    return x.replace(/0x/, '');
  }).join(''))).slice(-40)).toLowerCase();
};

exports.buildCreate2Address = buildCreate2Address;