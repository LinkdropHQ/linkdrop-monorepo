"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeForClaimEvents = void 0;

var _ethers = require("ethers");

var _Linkdrop = _interopRequireDefault(require("@linkdrop/contracts/build/Linkdrop"));

var subscribeForClaimEvents = function subscribeForClaimEvents(_ref, callback) {
  var jsonRpcUrl = _ref.jsonRpcUrl,
      proxyAddress = _ref.proxyAddress;
  var provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
  var contract = new _ethers.ethers.Contract(proxyAddress, _Linkdrop["default"].abi, provider);
  contract.on('Claimed', callback);
};

exports.subscribeForClaimEvents = subscribeForClaimEvents;