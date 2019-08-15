"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _LinkdropSDK = require("./LinkdropSDK");

var _WalletSDK = _interopRequireDefault(require("./wallet/WalletSDK"));

var _default = {
  LinkdropSDK: _LinkdropSDK.LinkdropSDK,
  WalletSDK: _WalletSDK["default"]
};
exports["default"] = _default;