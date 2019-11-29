"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

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
        claimHost = _ref$claimHost === void 0 ? 'https://claim.linkdrop.io' : _ref$claimHost;
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
  }

  (0, _createClass2["default"])(LinkdropSDK, [{
    key: "getVersion",
    value: function getVersion(campaignId) {
      return _regenerator["default"].async(function getVersion$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.version[campaignId]) {
                _context.next = 4;
                break;
              }

              _context.next = 3;
              return _regenerator["default"].awrap(this.factoryContract.getProxyMasterCopyVersion(this.senderAddress, campaignId));

            case 3:
              this.version[campaignId] = _context.sent;

            case 4:
              return _context.abrupt("return", this.version[campaignId]);

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "generateLink",
    value: function generateLink(_ref2) {
      var _ref2$campaignId, campaignId, _ref2$token, token, _ref2$nft, nft, _ref2$feeToken, feeToken, _ref2$feeReceiver, feeReceiver, _ref2$nativeTokensAmo, nativeTokensAmount, _ref2$tokensAmount, tokensAmount, _ref2$tokenId, tokenId, _ref2$feeAmount, feeAmount, _ref2$expiration, expiration, signingKeyOrWallet;

      return _regenerator["default"].async(function generateLink$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _ref2$campaignId = _ref2.campaignId, campaignId = _ref2$campaignId === void 0 ? 0 : _ref2$campaignId, _ref2$token = _ref2.token, token = _ref2$token === void 0 ? _constants.AddressZero : _ref2$token, _ref2$nft = _ref2.nft, nft = _ref2$nft === void 0 ? _constants.AddressZero : _ref2$nft, _ref2$feeToken = _ref2.feeToken, feeToken = _ref2$feeToken === void 0 ? _constants.AddressZero : _ref2$feeToken, _ref2$feeReceiver = _ref2.feeReceiver, feeReceiver = _ref2$feeReceiver === void 0 ? _constants.AddressZero : _ref2$feeReceiver, _ref2$nativeTokensAmo = _ref2.nativeTokensAmount, nativeTokensAmount = _ref2$nativeTokensAmo === void 0 ? 0 : _ref2$nativeTokensAmo, _ref2$tokensAmount = _ref2.tokensAmount, tokensAmount = _ref2$tokensAmount === void 0 ? 0 : _ref2$tokensAmount, _ref2$tokenId = _ref2.tokenId, tokenId = _ref2$tokenId === void 0 ? 0 : _ref2$tokenId, _ref2$feeAmount = _ref2.feeAmount, feeAmount = _ref2$feeAmount === void 0 ? 0 : _ref2$feeAmount, _ref2$expiration = _ref2.expiration, expiration = _ref2$expiration === void 0 ? 11111111111 : _ref2$expiration, signingKeyOrWallet = _ref2.signingKeyOrWallet;
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
              _context2.t14 = this.version[campaignId];

              if (_context2.t14) {
                _context2.next = 20;
                break;
              }

              _context2.next = 19;
              return _regenerator["default"].awrap(this.getVersion(campaignId));

            case 19:
              _context2.t14 = _context2.sent;

            case 20:
              _context2.t15 = _context2.t14;
              _context2.t16 = this.chainId;
              _context2.t17 = signingKeyOrWallet;
              _context2.t18 = {
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
                version: _context2.t15,
                chainId: _context2.t16,
                signingKeyOrWallet: _context2.t17
              };
              return _context2.abrupt("return", _context2.t0.generateLink.call(_context2.t0, _context2.t18));

            case 25:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getProxyAddress",
    value: function getProxyAddress() {
      var campaignId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return (0, _utils.computeProxyAddress)(this.factoryAddress, this.senderAddress, campaignId);
    }
  }, {
    key: "claim",
    value: function claim(_ref3) {
      var token, nft, feeToken, feeReceiver, linkKey, nativeTokensAmount, tokensAmount, tokenId, feeAmount, expiration, signerSignature, receiverAddress, linkdropContract, sender;
      return _regenerator["default"].async(function claim$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              token = _ref3.token, nft = _ref3.nft, feeToken = _ref3.feeToken, feeReceiver = _ref3.feeReceiver, linkKey = _ref3.linkKey, nativeTokensAmount = _ref3.nativeTokensAmount, tokensAmount = _ref3.tokensAmount, tokenId = _ref3.tokenId, feeAmount = _ref3.feeAmount, expiration = _ref3.expiration, signerSignature = _ref3.signerSignature, receiverAddress = _ref3.receiverAddress, linkdropContract = _ref3.linkdropContract, sender = _ref3.sender;
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
      }, null, this);
    }
  }, {
    key: "claimAndDeploy",
    value: function claimAndDeploy(_ref4) {
      var token, nft, feeToken, feeReceiver, linkKey, nativeTokensAmount, tokensAmount, tokenId, feeAmount, expiration, signerSignature, receiverAddress, linkdropContract, sender, _ref5, isDeployed;

      return _regenerator["default"].async(function claimAndDeploy$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              token = _ref4.token, nft = _ref4.nft, feeToken = _ref4.feeToken, feeReceiver = _ref4.feeReceiver, linkKey = _ref4.linkKey, nativeTokensAmount = _ref4.nativeTokensAmount, tokensAmount = _ref4.tokensAmount, tokenId = _ref4.tokenId, feeAmount = _ref4.feeAmount, expiration = _ref4.expiration, signerSignature = _ref4.signerSignature, receiverAddress = _ref4.receiverAddress, linkdropContract = _ref4.linkdropContract, sender = _ref4.sender;

              if (!(linkdropContract !== this.getProxyAddress())) {
                _context4.next = 3;
                break;
              }

              throw new Error('Linkdrop contract cannot be deployed by relayer. Invalid campaign id.');

            case 3:
              _context4.next = 5;
              return _regenerator["default"].awrap(this.isDeployed());

            case 5:
              _ref5 = _context4.sent;
              isDeployed = _ref5.isDeployed;

              if (!(isDeployed === true)) {
                _context4.next = 9;
                break;
              }

              throw new Error('Linkdrop contract is already deployed');

            case 9:
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
                signerSignature: signerSignature,
                receiverAddress: receiverAddress,
                linkdropContract: linkdropContract,
                sender: sender
              }));

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "topup",
    value: function topup(_ref6) {
      var signingKeyOrWallet, proxyAddress, nativeTokensAmount;
      return _regenerator["default"].async(function topup$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              signingKeyOrWallet = _ref6.signingKeyOrWallet, proxyAddress = _ref6.proxyAddress, nativeTokensAmount = _ref6.nativeTokensAmount;
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
      }, null, this);
    }
  }, {
    key: "approve",
    value: function approve(_ref7) {
      var signingKeyOrWallet, proxyAddress, tokenAddress, tokensAmount;
      return _regenerator["default"].async(function approve$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              signingKeyOrWallet = _ref7.signingKeyOrWallet, proxyAddress = _ref7.proxyAddress, tokenAddress = _ref7.tokenAddress, tokensAmount = _ref7.tokensAmount;
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
      }, null, this);
    }
  }, {
    key: "approveNFT",
    value: function approveNFT(_ref8) {
      var signingKeyOrWallet, proxyAddress, nftAddress;
      return _regenerator["default"].async(function approveNFT$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              signingKeyOrWallet = _ref8.signingKeyOrWallet, proxyAddress = _ref8.proxyAddress, nftAddress = _ref8.nftAddress;
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
      }, null, this);
    }
  }, {
    key: "deployProxy",
    value: function deployProxy(_ref9) {
      var signingKeyOrWallet, _ref9$campaignId, campaignId, _ref9$nativeTokensAmo, nativeTokensAmount;

      return _regenerator["default"].async(function deployProxy$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              signingKeyOrWallet = _ref9.signingKeyOrWallet, _ref9$campaignId = _ref9.campaignId, campaignId = _ref9$campaignId === void 0 ? 0 : _ref9$campaignId, _ref9$nativeTokensAmo = _ref9.nativeTokensAmount, nativeTokensAmount = _ref9$nativeTokensAmo === void 0 ? 0 : _ref9$nativeTokensAmo;
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
      }, null, this);
    }
  }, {
    key: "subscribeForClaimEvents",
    value: function subscribeForClaimEvents(proxyAddress, callback) {
      return _regenerator["default"].async(function subscribeForClaimEvents$(_context9) {
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
      }, null, this);
    }
  }, {
    key: "getLinkStatus",
    value: function getLinkStatus(linkId) {
      return _regenerator["default"].async(function getLinkStatus$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              return _context10.abrupt("return", claimUtils.getLinkStatus({
                apiHost: this.apiHost,
                senderAddress: this.senderAddress,
                linkId: linkId
              }));

            case 1:
            case "end":
              return _context10.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "cancelLink",
    value: function cancelLink(linkId) {
      return _regenerator["default"].async(function cancelLink$(_context11) {
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
      }, null, this);
    }
  }, {
    key: "isDeployed",
    value: function isDeployed() {
      var campaignId,
          _args12 = arguments;
      return _regenerator["default"].async(function isDeployed$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              campaignId = _args12.length > 0 && _args12[0] !== undefined ? _args12[0] : 0;
              return _context12.abrupt("return", deployUtils.isDeployed({
                apiHost: this.apiHost,
                senderAddress: this.senderAddress,
                campaignId: campaignId
              }));

            case 2:
            case "end":
              return _context12.stop();
          }
        }
      }, null, this);
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