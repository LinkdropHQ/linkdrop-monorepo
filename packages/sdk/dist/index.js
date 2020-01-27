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

var _constants = require("ethers/constants");

// Turn off annoying warnings
_ethers.ethers.errors.setLogLevel('error');

var LinkdropSDK =
/*#__PURE__*/
function () {
  function LinkdropSDK(_ref) {
    var senderAddress = _ref.senderAddress,
        factoryAddress = _ref.factoryAddress,
        _ref$chain = _ref.chain,
        chain = _ref$chain === void 0 ? 'mainnet' : _ref$chain,
        _ref$jsonRpcUrl = _ref.jsonRpcUrl,
        jsonRpcUrl = _ref$jsonRpcUrl === void 0 ? getJsonRpcUrl(chain) : _ref$jsonRpcUrl,
        _ref$apiHost = _ref.apiHost,
        apiHost = _ref$apiHost === void 0 ? "https://".concat(chain, ".linkdrop.io") : _ref$apiHost,
        _ref$claimHost = _ref.claimHost,
        claimHost = _ref$claimHost === void 0 ? 'https://claim-v2.linkdrop.io' : _ref$claimHost;
    (0, _classCallCheck2["default"])(this, LinkdropSDK);

    if (senderAddress == null || senderAddress === '') {
      throw new Error('Please provide sender address');
    }

    if (factoryAddress == null || factoryAddress === '') {
      throw new Error('Please provide factory address');
    }

    if (chain !== 'mainnet' && chain !== 'ropsten' && chain !== 'rinkeby' && chain !== 'goerli' && chain !== 'kovan' && chain !== 'xdai') {
      throw new Error('Unsupported chain');
    }

    this.senderAddress = senderAddress;
    this.factoryAddress = factoryAddress;
    this.chain = chain;
    this.chainId = getChainId(chain);
    this.jsonRpcUrl = jsonRpcUrl;
    this.apiHost = apiHost;
    this.claimHost = claimHost;
    this.version = {};
    this.provider = new _ethers.ethers.providers.JsonRpcProvider(jsonRpcUrl);
    this.factoryContract = new _ethers.ethers.Contract(factoryAddress, _LinkdropFactory["default"].abi, this.provider);
    this.claimAndDeploy = this.claimAndDeploy.bind(this);
    this.generateLink = this.generateLink.bind(this);
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
                return this.factoryContract.getProxyMasterCopyVersion(this.senderAddress, campaignId);

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
        var _ref2$campaignId, campaignId, _ref2$token, token, _ref2$nft, nft, _ref2$feeToken, feeToken, _ref2$feeReceiver, feeReceiver, _ref2$nativeTokensAmo, nativeTokensAmount, _ref2$tokensAmount, tokensAmount, _ref2$tokenId, tokenId, _ref2$feeAmount, feeAmount, _ref2$expiration, expiration, _ref2$data, data, signingKeyOrWallet;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _ref2$campaignId = _ref2.campaignId, campaignId = _ref2$campaignId === void 0 ? 0 : _ref2$campaignId, _ref2$token = _ref2.token, token = _ref2$token === void 0 ? _constants.AddressZero : _ref2$token, _ref2$nft = _ref2.nft, nft = _ref2$nft === void 0 ? _constants.AddressZero : _ref2$nft, _ref2$feeToken = _ref2.feeToken, feeToken = _ref2$feeToken === void 0 ? _constants.AddressZero : _ref2$feeToken, _ref2$feeReceiver = _ref2.feeReceiver, feeReceiver = _ref2$feeReceiver === void 0 ? _constants.AddressZero : _ref2$feeReceiver, _ref2$nativeTokensAmo = _ref2.nativeTokensAmount, nativeTokensAmount = _ref2$nativeTokensAmo === void 0 ? 0 : _ref2$nativeTokensAmo, _ref2$tokensAmount = _ref2.tokensAmount, tokensAmount = _ref2$tokensAmount === void 0 ? 0 : _ref2$tokensAmount, _ref2$tokenId = _ref2.tokenId, tokenId = _ref2$tokenId === void 0 ? 0 : _ref2$tokenId, _ref2$feeAmount = _ref2.feeAmount, feeAmount = _ref2$feeAmount === void 0 ? 0 : _ref2$feeAmount, _ref2$expiration = _ref2.expiration, expiration = _ref2$expiration === void 0 ? 11111111111 : _ref2$expiration, _ref2$data = _ref2.data, data = _ref2$data === void 0 ? '0x' : _ref2$data, signingKeyOrWallet = _ref2.signingKeyOrWallet;
                _context2.t0 = generateLinkUtils;
                _context2.t1 = this.claimHost;
                _context2.t2 = this.factoryAddress;
                _context2.t3 = this.senderAddress;
                _context2.t4 = campaignId;
                _context2.t5 = token;
                _context2.t6 = nft;
                _context2.t7 = feeToken;
                _context2.t8 = feeReceiver;
                _context2.t9 = nativeTokensAmount;
                _context2.t10 = tokensAmount;
                _context2.t11 = tokenId;
                _context2.t12 = feeAmount;
                _context2.t13 = expiration;
                _context2.t14 = data;
                _context2.t15 = this.version[campaignId];

                if (_context2.t15) {
                  _context2.next = 21;
                  break;
                }

                _context2.next = 20;
                return this.getVersion(campaignId);

              case 20:
                _context2.t15 = _context2.sent;

              case 21:
                _context2.t16 = _context2.t15;
                _context2.t17 = this.chainId;
                _context2.t18 = signingKeyOrWallet;
                _context2.t19 = {
                  claimHost: _context2.t1,
                  factory: _context2.t2,
                  sender: _context2.t3,
                  campaignId: _context2.t4,
                  token: _context2.t5,
                  nft: _context2.t6,
                  feeToken: _context2.t7,
                  feeReceiver: _context2.t8,
                  nativeTokensAmount: _context2.t9,
                  tokensAmount: _context2.t10,
                  tokenId: _context2.t11,
                  feeAmount: _context2.t12,
                  expiration: _context2.t13,
                  data: _context2.t14,
                  version: _context2.t16,
                  chainId: _context2.t17,
                  signingKeyOrWallet: _context2.t18
                };
                return _context2.abrupt("return", _context2.t0.generateLink.call(_context2.t0, _context2.t19));

              case 26:
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
    key: "getProxyAddress",
    value: function getProxyAddress() {
      var campaignId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return (0, _utils.computeProxyAddress)(this.factoryAddress, this.senderAddress, campaignId);
    }
  }, {
    key: "claim",
    value: function () {
      var _claim = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref3) {
        var _ref3$token, token, _ref3$nft, nft, _ref3$feeToken, feeToken, _ref3$feeReceiver, feeReceiver, _ref3$nativeTokensAmo, nativeTokensAmount, _ref3$tokensAmount, tokensAmount, _ref3$tokenId, tokenId, _ref3$feeAmount, feeAmount, _ref3$expiration, expiration, _ref3$data, data, linkKey, signerSignature, receiverAddress, linkdropContract, sender;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _ref3$token = _ref3.token, token = _ref3$token === void 0 ? _constants.AddressZero : _ref3$token, _ref3$nft = _ref3.nft, nft = _ref3$nft === void 0 ? _constants.AddressZero : _ref3$nft, _ref3$feeToken = _ref3.feeToken, feeToken = _ref3$feeToken === void 0 ? _constants.AddressZero : _ref3$feeToken, _ref3$feeReceiver = _ref3.feeReceiver, feeReceiver = _ref3$feeReceiver === void 0 ? _constants.AddressZero : _ref3$feeReceiver, _ref3$nativeTokensAmo = _ref3.nativeTokensAmount, nativeTokensAmount = _ref3$nativeTokensAmo === void 0 ? 0 : _ref3$nativeTokensAmo, _ref3$tokensAmount = _ref3.tokensAmount, tokensAmount = _ref3$tokensAmount === void 0 ? 0 : _ref3$tokensAmount, _ref3$tokenId = _ref3.tokenId, tokenId = _ref3$tokenId === void 0 ? 0 : _ref3$tokenId, _ref3$feeAmount = _ref3.feeAmount, feeAmount = _ref3$feeAmount === void 0 ? 0 : _ref3$feeAmount, _ref3$expiration = _ref3.expiration, expiration = _ref3$expiration === void 0 ? 11111111111 : _ref3$expiration, _ref3$data = _ref3.data, data = _ref3$data === void 0 ? '0x' : _ref3$data, linkKey = _ref3.linkKey, signerSignature = _ref3.signerSignature, receiverAddress = _ref3.receiverAddress, linkdropContract = _ref3.linkdropContract, sender = _ref3.sender;
                return _context3.abrupt("return", claimUtils.claim({
                  jsonRpcUrl: this.jsonRpcUrl,
                  apiHost: this.apiHost,
                  token: token,
                  nft: nft,
                  feeToken: feeToken,
                  feeReceiver: feeReceiver,
                  linkKey: linkKey,
                  nativeTokensAmount: nativeTokensAmount,
                  tokensAmount: tokensAmount,
                  tokenId: tokenId,
                  feeAmount: feeAmount,
                  expiration: expiration,
                  data: data,
                  signerSignature: signerSignature,
                  receiverAddress: receiverAddress,
                  linkdropContract: linkdropContract,
                  sender: sender
                }));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function claim(_x3) {
        return _claim.apply(this, arguments);
      }

      return claim;
    }()
  }, {
    key: "claimAndDeploy",
    value: function () {
      var _claimAndDeploy = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref4) {
        var token, nft, feeToken, feeReceiver, linkKey, nativeTokensAmount, tokensAmount, tokenId, feeAmount, expiration, _ref4$data, data, signerSignature, receiverAddress, linkdropContract, sender, isDeployed;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                token = _ref4.token, nft = _ref4.nft, feeToken = _ref4.feeToken, feeReceiver = _ref4.feeReceiver, linkKey = _ref4.linkKey, nativeTokensAmount = _ref4.nativeTokensAmount, tokensAmount = _ref4.tokensAmount, tokenId = _ref4.tokenId, feeAmount = _ref4.feeAmount, expiration = _ref4.expiration, _ref4$data = _ref4.data, data = _ref4$data === void 0 ? '0x' : _ref4$data, signerSignature = _ref4.signerSignature, receiverAddress = _ref4.receiverAddress, linkdropContract = _ref4.linkdropContract, sender = _ref4.sender;
                console.log('here');

                if (!(linkdropContract !== this.getProxyAddress())) {
                  _context4.next = 5;
                  break;
                }

                console.log('here11');
                throw new Error('Linkdrop contract cannot be deployed by relayer. Invalid campaign id.');

              case 5:
                _context4.next = 7;
                return this.isDeployed();

              case 7:
                isDeployed = _context4.sent;
                console.log('here1');

                if (!(isDeployed === true)) {
                  _context4.next = 11;
                  break;
                }

                throw new Error('Linkdrop contract is already deployed');

              case 11:
                console.log('here2');
                return _context4.abrupt("return", claimUtils.claimAndDeploy({
                  jsonRpcUrl: this.jsonRpcUrl,
                  apiHost: this.apiHost,
                  factory: this.factoryAddress,
                  token: token,
                  nft: nft,
                  feeToken: feeToken,
                  feeReceiver: feeReceiver,
                  linkKey: linkKey,
                  nativeTokensAmount: nativeTokensAmount,
                  tokensAmount: tokensAmount,
                  tokenId: tokenId,
                  feeAmount: feeAmount,
                  expiration: expiration,
                  data: data,
                  signerSignature: signerSignature,
                  receiverAddress: receiverAddress,
                  linkdropContract: linkdropContract,
                  sender: sender
                }));

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function claimAndDeploy(_x4) {
        return _claimAndDeploy.apply(this, arguments);
      }

      return claimAndDeploy;
    }()
  }, {
    key: "topup",
    value: function () {
      var _topup = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(_ref5) {
        var signingKeyOrWallet, proxyAddress, nativeTokensAmount;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                signingKeyOrWallet = _ref5.signingKeyOrWallet, proxyAddress = _ref5.proxyAddress, nativeTokensAmount = _ref5.nativeTokensAmount;
                return _context5.abrupt("return", topupAndApproveUtils.topup({
                  jsonRpcUrl: this.jsonRpcUrl,
                  signingKeyOrWallet: signingKeyOrWallet,
                  proxyAddress: proxyAddress,
                  nativeTokensAmount: nativeTokensAmount
                }));

              case 2:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function topup(_x5) {
        return _topup.apply(this, arguments);
      }

      return topup;
    }()
  }, {
    key: "approve",
    value: function () {
      var _approve = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(_ref6) {
        var signingKeyOrWallet, proxyAddress, tokenAddress, tokensAmount;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                signingKeyOrWallet = _ref6.signingKeyOrWallet, proxyAddress = _ref6.proxyAddress, tokenAddress = _ref6.tokenAddress, tokensAmount = _ref6.tokensAmount;
                return _context6.abrupt("return", topupAndApproveUtils.approve({
                  jsonRpcUrl: this.jsonRpcUrl,
                  signingKeyOrWallet: signingKeyOrWallet,
                  proxyAddress: proxyAddress,
                  tokenAddress: tokenAddress,
                  tokensAmount: tokensAmount
                }));

              case 2:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function approve(_x6) {
        return _approve.apply(this, arguments);
      }

      return approve;
    }()
  }, {
    key: "approveNFT",
    value: function () {
      var _approveNFT = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(_ref7) {
        var signingKeyOrWallet, proxyAddress, nftAddress;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                signingKeyOrWallet = _ref7.signingKeyOrWallet, proxyAddress = _ref7.proxyAddress, nftAddress = _ref7.nftAddress;
                return _context7.abrupt("return", topupAndApproveUtils.approveNFT({
                  jsonRpcUrl: this.jsonRpcUrl,
                  signingKeyOrWallet: signingKeyOrWallet,
                  proxyAddress: proxyAddress,
                  nftAddress: nftAddress
                }));

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function approveNFT(_x7) {
        return _approveNFT.apply(this, arguments);
      }

      return approveNFT;
    }()
  }, {
    key: "deployProxy",
    value: function () {
      var _deployProxy = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8(_ref8) {
        var signingKeyOrWallet, _ref8$campaignId, campaignId, _ref8$nativeTokensAmo, nativeTokensAmount;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                signingKeyOrWallet = _ref8.signingKeyOrWallet, _ref8$campaignId = _ref8.campaignId, campaignId = _ref8$campaignId === void 0 ? 0 : _ref8$campaignId, _ref8$nativeTokensAmo = _ref8.nativeTokensAmount, nativeTokensAmount = _ref8$nativeTokensAmo === void 0 ? 0 : _ref8$nativeTokensAmo;
                return _context8.abrupt("return", deployUtils.deployProxy({
                  jsonRpcUrl: this.jsonRpcUrl,
                  factoryAddress: this.factoryAddress,
                  signingKeyOrWallet: signingKeyOrWallet,
                  campaignId: campaignId,
                  nativeTokensAmount: nativeTokensAmount
                }));

              case 2:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function deployProxy(_x8) {
        return _deployProxy.apply(this, arguments);
      }

      return deployProxy;
    }()
  }, {
    key: "subscribeForClaimEvents",
    value: function () {
      var _subscribeForClaimEvents2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9(proxyAddress, callback) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.abrupt("return", (0, _subscribeForEvents.subscribeForClaimEvents)({
                  jsonRpcUrl: this.jsonRpcUrl,
                  proxyAddress: proxyAddress
                }, callback));

              case 1:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function subscribeForClaimEvents(_x9, _x10) {
        return _subscribeForClaimEvents2.apply(this, arguments);
      }

      return subscribeForClaimEvents;
    }()
  }, {
    key: "getLinkStatus",
    value: function () {
      var _getLinkStatus = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10(linkId) {
        var campaignId,
            _args10 = arguments;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                campaignId = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : 0;
                return _context10.abrupt("return", claimUtils.getLinkStatus({
                  apiHost: this.apiHost,
                  linkdropContractAddress: this.getProxyAddress(campaignId),
                  linkId: linkId
                }));

              case 2:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getLinkStatus(_x11) {
        return _getLinkStatus.apply(this, arguments);
      }

      return getLinkStatus;
    }()
  }, {
    key: "cancelLink",
    value: function () {
      var _cancelLink = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee11(linkId) {
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", claimUtils.cancelLink({
                  apiHost: this.apiHost,
                  senderAddress: this.senderAddress,
                  linkId: linkId
                }));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function cancelLink(_x12) {
        return _cancelLink.apply(this, arguments);
      }

      return cancelLink;
    }()
  }, {
    key: "isDeployed",
    value: function () {
      var _isDeployed = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee12() {
        var campaignId,
            _args12 = arguments;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                campaignId = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : 0;
                console.log({
                  campaignId: campaignId,
                  jsonRpcUrl: this.jsonRpcUrl,
                  factoryAddress: this.factoryAddress,
                  senderAddress: this.senderAddress
                });
                return _context12.abrupt("return", deployUtils.isDeployed({
                  jsonRpcUrl: this.jsonRpcUrl,
                  factoryAddress: this.factoryAddress,
                  senderAddress: this.senderAddress,
                  campaignId: campaignId
                }));

              case 3:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function isDeployed() {
        return _isDeployed.apply(this, arguments);
      }

      return isDeployed;
    }()
  }, {
    key: "encodeParams",
    value: function encodeParams(abi, method) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      return (0, _utils.encodeParams)(abi, method, params);
    }
  }, {
    key: "encodeTransaction",
    value: function encodeTransaction(to) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0x';
      return (0, _utils.encodeTransaction)(to, value, data);
    }
  }]);
  return LinkdropSDK;
}();

function getJsonRpcUrl(chain) {
  switch (chain) {
    case 'xdai':
      return 'https://dai.poa.network';

    default:
      return "https://".concat(chain, ".infura.io");
  }
}

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

    case 'xdai':
      return 100;

    default:
      return null;
  }
}

var _default = LinkdropSDK;
exports["default"] = _default;