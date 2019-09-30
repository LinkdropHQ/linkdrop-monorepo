"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _utils = require("./utils");

var generateLinkUtils = _interopRequireWildcard(require("./generateLink"));

var claimUtils = _interopRequireWildcard(require("./claim"));

var deployUtils = _interopRequireWildcard(require("./deployProxy"));

var topupAndApproveUtils = _interopRequireWildcard(require("./topupAndApprove"));

var _subscribeForEvents = require("./subscribeForEvents");

var _LinkdropFactory = _interopRequireDefault(require("@linkdrop/contracts/build/LinkdropFactory"));

var _ethers = require("ethers");

// Turn off annoying warnings
_ethers.ethers.errors.setLogLevel('error');

var LinkdropSDK =
/*#__PURE__*/
function () {
  function LinkdropSDK(_ref) {
    var linkdropMasterAddress = _ref.linkdropMasterAddress,
        factoryAddress = _ref.factoryAddress,
        _ref$chain = _ref.chain,
        chain = _ref$chain === void 0 ? 'mainnet' : _ref$chain,
        _ref$jsonRpcUrl = _ref.jsonRpcUrl,
        jsonRpcUrl = _ref$jsonRpcUrl === void 0 ? "https://".concat(chain, ".infura.io") : _ref$jsonRpcUrl,
        _ref$apiHost = _ref.apiHost,
        apiHost = _ref$apiHost === void 0 ? "https://".concat(chain, ".linkdrop.io") : _ref$apiHost,
        _ref$claimHost = _ref.claimHost,
        claimHost = _ref$claimHost === void 0 ? 'https://claim.linkdrop.io' : _ref$claimHost;
    (0, _classCallCheck2["default"])(this, LinkdropSDK);

    if (linkdropMasterAddress == null || linkdropMasterAddress === '') {
      throw new Error('Please provide linkdrop master address');
    }

    if (factoryAddress == null || factoryAddress === '') {
      throw new Error('Please provide factory address');
    }

    if (chain !== 'mainnet' && chain !== 'ropsten' && chain !== 'rinkeby' && chain !== 'goerli' && chain !== 'kovan') {
      throw new Error('Unsupported chain');
    }

    this.linkdropMasterAddress = linkdropMasterAddress;
    this.factoryAddress = factoryAddress;
    this.chain = chain;
    this.chainId = getChainId(chain);
    this.jsonRpcUrl = jsonRpcUrl;
    this.apiHost = apiHost;
    this.claimHost = claimHost;
    this.version = {};
    this.provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
    this.factoryContract = new _ethers.ethers.Contract(factoryAddress, _LinkdropFactory["default"].abi, this.provider);
  }

  (0, _createClass2["default"])(LinkdropSDK, [{
    key: "getVersion",
    value: function () {
      var _getVersion = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(campaignId) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.version[campaignId]) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return this.factoryContract.getProxyMasterCopyVersion(this.linkdropMasterAddress, campaignId);

              case 3:
                this.version[campaignId] = _context.sent;

              case 4:
                return _context.abrupt("return", this.version[campaignId]);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getVersion(_x) {
        return _getVersion.apply(this, arguments);
      }

      return getVersion;
    }()
  }, {
    key: "generateLink",
    value: function () {
      var _generateLink = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(_ref2) {
        var signingKeyOrWallet, weiAmount, tokenAddress, tokenAmount, _ref2$expirationTime, expirationTime, campaignId;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                signingKeyOrWallet = _ref2.signingKeyOrWallet, weiAmount = _ref2.weiAmount, tokenAddress = _ref2.tokenAddress, tokenAmount = _ref2.tokenAmount, _ref2$expirationTime = _ref2.expirationTime, expirationTime = _ref2$expirationTime === void 0 ? 12345678910 : _ref2$expirationTime, campaignId = _ref2.campaignId;
                _context2.t0 = generateLinkUtils;
                _context2.t1 = this.factoryAddress;
                _context2.t2 = this.chainId;
                _context2.t3 = this.claimHost;
                _context2.t4 = this.linkdropMasterAddress;
                _context2.t5 = signingKeyOrWallet;
                _context2.t6 = weiAmount;
                _context2.t7 = tokenAddress;
                _context2.t8 = tokenAmount;
                _context2.t9 = expirationTime;
                _context2.t10 = this.version[campaignId];

                if (_context2.t10) {
                  _context2.next = 16;
                  break;
                }

                _context2.next = 15;
                return this.getVersion(campaignId);

              case 15:
                _context2.t10 = _context2.sent;

              case 16:
                _context2.t11 = _context2.t10;
                _context2.t12 = campaignId;
                _context2.t13 = {
                  factoryAddress: _context2.t1,
                  chainId: _context2.t2,
                  claimHost: _context2.t3,
                  linkdropMasterAddress: _context2.t4,
                  signingKeyOrWallet: _context2.t5,
                  weiAmount: _context2.t6,
                  tokenAddress: _context2.t7,
                  tokenAmount: _context2.t8,
                  expirationTime: _context2.t9,
                  version: _context2.t11,
                  campaignId: _context2.t12
                };
                return _context2.abrupt("return", _context2.t0.generateLink.call(_context2.t0, _context2.t13));

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function generateLink(_x2) {
        return _generateLink.apply(this, arguments);
      }

      return generateLink;
    }()
  }, {
    key: "generateLinkERC721",
    value: function () {
      var _generateLinkERC = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref3) {
        var signingKeyOrWallet, weiAmount, nftAddress, tokenId, _ref3$expirationTime, expirationTime, campaignId;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                signingKeyOrWallet = _ref3.signingKeyOrWallet, weiAmount = _ref3.weiAmount, nftAddress = _ref3.nftAddress, tokenId = _ref3.tokenId, _ref3$expirationTime = _ref3.expirationTime, expirationTime = _ref3$expirationTime === void 0 ? 12345678910 : _ref3$expirationTime, campaignId = _ref3.campaignId;
                _context3.t0 = generateLinkUtils;
                _context3.t1 = this.factoryAddress;
                _context3.t2 = this.chainId;
                _context3.t3 = this.claimHost;
                _context3.t4 = this.linkdropMasterAddress;
                _context3.t5 = signingKeyOrWallet;
                _context3.t6 = weiAmount;
                _context3.t7 = nftAddress;
                _context3.t8 = tokenId;
                _context3.t9 = expirationTime;
                _context3.t10 = this.version[campaignId];

                if (_context3.t10) {
                  _context3.next = 16;
                  break;
                }

                _context3.next = 15;
                return this.getVersion(campaignId);

              case 15:
                _context3.t10 = _context3.sent;

              case 16:
                _context3.t11 = _context3.t10;
                _context3.t12 = campaignId;
                _context3.t13 = {
                  factoryAddress: _context3.t1,
                  chainId: _context3.t2,
                  claimHost: _context3.t3,
                  linkdropMasterAddress: _context3.t4,
                  signingKeyOrWallet: _context3.t5,
                  weiAmount: _context3.t6,
                  nftAddress: _context3.t7,
                  tokenId: _context3.t8,
                  expirationTime: _context3.t9,
                  version: _context3.t11,
                  campaignId: _context3.t12
                };
                return _context3.abrupt("return", _context3.t0.generateLinkERC721.call(_context3.t0, _context3.t13));

              case 20:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function generateLinkERC721(_x3) {
        return _generateLinkERC.apply(this, arguments);
      }

      return generateLinkERC721;
    }()
  }, {
    key: "getProxyAddress",
    value: function getProxyAddress(campaingId) {
      return (0, _utils.computeProxyAddress)(this.factoryAddress, this.linkdropMasterAddress, campaingId);
    }
  }, {
    key: "claim",
    value: function () {
      var _claim = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref4) {
        var weiAmount, tokenAddress, tokenAmount, _ref4$expirationTime, expirationTime, linkKey, linkdropSignerSignature, receiverAddress, campaignId;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                weiAmount = _ref4.weiAmount, tokenAddress = _ref4.tokenAddress, tokenAmount = _ref4.tokenAmount, _ref4$expirationTime = _ref4.expirationTime, expirationTime = _ref4$expirationTime === void 0 ? 12345678910 : _ref4$expirationTime, linkKey = _ref4.linkKey, linkdropSignerSignature = _ref4.linkdropSignerSignature, receiverAddress = _ref4.receiverAddress, campaignId = _ref4.campaignId;
                _context4.t0 = claimUtils;
                _context4.t1 = this.json;
                _context4.t2 = this.apiHost;
                _context4.t3 = weiAmount;
                _context4.t4 = tokenAddress;
                _context4.t5 = tokenAmount;
                _context4.t6 = expirationTime;
                _context4.t7 = this.version[campaignId];

                if (_context4.t7) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 12;
                return this.getVersion(campaignId);

              case 12:
                _context4.t7 = _context4.sent;

              case 13:
                _context4.t8 = _context4.t7;
                _context4.t9 = this.chainId;
                _context4.t10 = linkKey;
                _context4.t11 = this.linkdropMasterAddress;
                _context4.t12 = linkdropSignerSignature;
                _context4.t13 = receiverAddress;
                _context4.t14 = this.factoryAddress;
                _context4.t15 = campaignId;
                _context4.t16 = {
                  jsonRpcUrl: _context4.t1,
                  apiHost: _context4.t2,
                  weiAmount: _context4.t3,
                  tokenAddress: _context4.t4,
                  tokenAmount: _context4.t5,
                  expirationTime: _context4.t6,
                  version: _context4.t8,
                  chainId: _context4.t9,
                  linkKey: _context4.t10,
                  linkdropMasterAddress: _context4.t11,
                  linkdropSignerSignature: _context4.t12,
                  receiverAddress: _context4.t13,
                  factoryAddress: _context4.t14,
                  campaignId: _context4.t15
                };
                return _context4.abrupt("return", _context4.t0.claim.call(_context4.t0, _context4.t16));

              case 23:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function claim(_x4) {
        return _claim.apply(this, arguments);
      }

      return claim;
    }()
  }, {
    key: "claimERC721",
    value: function () {
      var _claimERC = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref5) {
        var weiAmount, nftAddress, tokenId, _ref5$expirationTime, expirationTime, linkKey, linkdropSignerSignature, receiverAddress, campaignId;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                weiAmount = _ref5.weiAmount, nftAddress = _ref5.nftAddress, tokenId = _ref5.tokenId, _ref5$expirationTime = _ref5.expirationTime, expirationTime = _ref5$expirationTime === void 0 ? 12345678910 : _ref5$expirationTime, linkKey = _ref5.linkKey, linkdropSignerSignature = _ref5.linkdropSignerSignature, receiverAddress = _ref5.receiverAddress, campaignId = _ref5.campaignId;
                _context5.t0 = claimUtils;
                _context5.t1 = this.jsonRpcUrl;
                _context5.t2 = this.apiHost;
                _context5.t3 = weiAmount;
                _context5.t4 = nftAddress;
                _context5.t5 = tokenId;
                _context5.t6 = expirationTime;
                _context5.t7 = this.version[campaignId];

                if (_context5.t7) {
                  _context5.next = 13;
                  break;
                }

                _context5.next = 12;
                return this.getVersion(campaignId);

              case 12:
                _context5.t7 = _context5.sent;

              case 13:
                _context5.t8 = _context5.t7;
                _context5.t9 = this.chainId;
                _context5.t10 = linkKey;
                _context5.t11 = this.linkdropMasterAddress;
                _context5.t12 = linkdropSignerSignature;
                _context5.t13 = receiverAddress;
                _context5.t14 = this.factoryAddress;
                _context5.t15 = campaignId;
                _context5.t16 = {
                  jsonRpcUrl: _context5.t1,
                  apiHost: _context5.t2,
                  weiAmount: _context5.t3,
                  nftAddress: _context5.t4,
                  tokenId: _context5.t5,
                  expirationTime: _context5.t6,
                  version: _context5.t8,
                  chainId: _context5.t9,
                  linkKey: _context5.t10,
                  linkdropMasterAddress: _context5.t11,
                  linkdropSignerSignature: _context5.t12,
                  receiverAddress: _context5.t13,
                  factoryAddress: _context5.t14,
                  campaignId: _context5.t15
                };
                return _context5.abrupt("return", _context5.t0.claimERC721.call(_context5.t0, _context5.t16));

              case 23:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function claimERC721(_x5) {
        return _claimERC.apply(this, arguments);
      }

      return claimERC721;
    }()
  }, {
    key: "topup",
    value: function () {
      var _topup = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(_ref6) {
        var signingKeyOrWallet, proxyAddress, weiAmount;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                signingKeyOrWallet = _ref6.signingKeyOrWallet, proxyAddress = _ref6.proxyAddress, weiAmount = _ref6.weiAmount;
                return _context6.abrupt("return", topupAndApproveUtils.topup({
                  jsonRpcUrl: this.jsonRpcUrl,
                  signingKeyOrWallet: signingKeyOrWallet,
                  proxyAddress: proxyAddress,
                  weiAmount: weiAmount
                }));

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function topup(_x6) {
        return _topup.apply(this, arguments);
      }

      return topup;
    }()
  }, {
    key: "approve",
    value: function () {
      var _approve = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(_ref7) {
        var signingKeyOrWallet, proxyAddress, tokenAddress, tokenAmount;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                signingKeyOrWallet = _ref7.signingKeyOrWallet, proxyAddress = _ref7.proxyAddress, tokenAddress = _ref7.tokenAddress, tokenAmount = _ref7.tokenAmount;
                return _context7.abrupt("return", topupAndApproveUtils.approve({
                  jsonRpcUrl: this.jsonRpcUrl,
                  signingKeyOrWallet: signingKeyOrWallet,
                  proxyAddress: proxyAddress,
                  tokenAddress: tokenAddress,
                  tokenAmount: tokenAmount
                }));

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function approve(_x7) {
        return _approve.apply(this, arguments);
      }

      return approve;
    }()
  }, {
    key: "approveERC721",
    value: function () {
      var _approveERC = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8(_ref8) {
        var signingKeyOrWallet, proxyAddress, nftAddress;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                signingKeyOrWallet = _ref8.signingKeyOrWallet, proxyAddress = _ref8.proxyAddress, nftAddress = _ref8.nftAddress;
                return _context8.abrupt("return", topupAndApproveUtils.approveERC721({
                  jsonRpcUrl: this.jsonRpcUrl,
                  signingKeyOrWallet: signingKeyOrWallet,
                  proxyAddress: proxyAddress,
                  nftAddress: nftAddress
                }));

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function approveERC721(_x8) {
        return _approveERC.apply(this, arguments);
      }

      return approveERC721;
    }()
  }, {
    key: "deployProxy",
    value: function () {
      var _deployProxy = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9(_ref9) {
        var signingKeyOrWallet, _ref9$campaignId, campaignId, weiAmount;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                signingKeyOrWallet = _ref9.signingKeyOrWallet, _ref9$campaignId = _ref9.campaignId, campaignId = _ref9$campaignId === void 0 ? 0 : _ref9$campaignId, weiAmount = _ref9.weiAmount;
                return _context9.abrupt("return", deployUtils.deployProxy({
                  jsonRpcUrl: this.jsonRpcUrl,
                  factoryAddress: this.factoryAddress,
                  signingKeyOrWallet: signingKeyOrWallet,
                  campaignId: campaignId,
                  weiAmount: weiAmount
                }));

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function deployProxy(_x9) {
        return _deployProxy.apply(this, arguments);
      }

      return deployProxy;
    }()
  }, {
    key: "subscribeForClaimedEvents",
    value: function () {
      var _subscribeForClaimedEvents2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10(proxyAddress, callback) {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", (0, _subscribeForEvents.subscribeForClaimedEvents)({
                  jsonRpcUrl: this.jsonRpcUrl,
                  proxyAddress: proxyAddress
                }, callback));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function subscribeForClaimedEvents(_x10, _x11) {
        return _subscribeForClaimedEvents2.apply(this, arguments);
      }

      return subscribeForClaimedEvents;
    }()
  }, {
    key: "subscribeForClaimedERC721Events",
    value: function () {
      var _subscribeForClaimedERC721Events2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee11(proxyAddress, callback) {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", (0, _subscribeForEvents.subscribeForClaimedERC721Events)({
                  jsonRpcUrl: this.jsonRpcUrl,
                  proxyAddress: proxyAddress
                }, callback));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function subscribeForClaimedERC721Events(_x12, _x13) {
        return _subscribeForClaimedERC721Events2.apply(this, arguments);
      }

      return subscribeForClaimedERC721Events;
    }()
  }, {
    key: "getLinkStatus",
    value: function () {
      var _getLinkStatus = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee12(linkId) {
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", claimUtils.getLinkStatus({
                  apiHost: this.apiHost,
                  linkdropMasterAddress: this.linkdropMasterAddress,
                  linkId: linkId
                }));

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function getLinkStatus(_x14) {
        return _getLinkStatus.apply(this, arguments);
      }

      return getLinkStatus;
    }()
  }, {
    key: "cancelLink",
    value: function () {
      var _cancelLink = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee13(linkId) {
        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt("return", claimUtils.cancelLink({
                  apiHost: this.apiHost,
                  linkdropMasterAddress: this.linkdropMasterAddress,
                  linkId: linkId
                }));

              case 1:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function cancelLink(_x15) {
        return _cancelLink.apply(this, arguments);
      }

      return cancelLink;
    }()
  }]);
  return LinkdropSDK;
}();

function getChainId(chain) {
  switch (chain) {
    case 'mainnet':
      return 1;

    case 'ropsten':
      return 3;

    case 'rinkeby':
      return 4;

    case 'goerli':
      return 5;

    case 'kovan':
      return 42;

    default:
      return null;
  }
}

var _default = LinkdropSDK;
exports["default"] = _default;