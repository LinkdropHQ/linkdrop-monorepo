"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeForClaimedERC721Events = exports.subscribeForClaimedEvents = void 0;

var _ethers = require("ethers");

var _LinkdropMastercopy = _interopRequireDefault(require("@linkdrop/contracts/build/LinkdropMastercopy"));

var subscribeForClaimedEvents = function subscribeForClaimedEvents(_ref, callback) {
  var jsonRpcUrl = _ref.jsonRpcUrl,
      proxyAddress = _ref.proxyAddress;
  var provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
  var contract = new _ethers.ethers.Contract(proxyAddress, _LinkdropMastercopy["default"].abi, provider);
  contract.on('Claimed', callback);
};

exports.subscribeForClaimedEvents = subscribeForClaimedEvents;

var subscribeForClaimedERC721Events = function subscribeForClaimedERC721Events(_ref2, callback) {
  var jsonRpcUrl = _ref2.jsonRpcUrl,
      proxyAddress = _ref2.proxyAddress;
  var provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
  var contract = new _ethers.ethers.Contract(proxyAddress, _LinkdropMastercopy["default"].abi, provider);
  contract.on('ClaimedERC721', callback);
};

exports.subscribeForClaimedERC721Events = subscribeForClaimedERC721Events;