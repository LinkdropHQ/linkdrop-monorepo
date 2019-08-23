"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _sdk = _interopRequireDefault(require("@universal-login/sdk"));

var _sdk2 = require("@linkdrop/sdk");

var _DeploymentReadyObserver = require("@universal-login/sdk/dist/lib/core/observers/DeploymentReadyObserver");

var _FutureWalletFactory = require("@universal-login/sdk/dist/lib/api/FutureWalletFactory");

var _box = _interopRequireDefault(require("3box"));

var _trufflePrivatekeyProvider = _interopRequireDefault(require("truffle-privatekey-provider"));

var _commons = require("@universal-login/commons");

var _LinkdropFactory = _interopRequireDefault(require("@linkdrop/contracts/build/LinkdropFactory.json"));

var _ethers = require("ethers");

var _claimAndDeploy3 = require("./claimAndDeploy");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var SPACE_NAME = 'LINKDROP_WALLET';

var WalletSDK =
/*#__PURE__*/
function () {
  //
  function WalletSDK() {
    var chain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'rinkeby';
    (0, _classCallCheck2["default"])(this, WalletSDK);

    if (chain !== 'mainnet' && chain !== 'rinkeby') {
      throw new Error('Chain not supported');
    }

    this.chain = chain;
    this.jsonRpcUrl = "https://".concat(chain, ".infura.io");
    this.sdk = new _sdk["default"]("https://".concat(chain, "-ul.linkdrop.io"), this.jsonRpcUrl);
  }

  (0, _createClass2["default"])(WalletSDK, [{
    key: "get3BoxSpace",
    value: function () {
      var _get3BoxSpace = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(privateKey) {
        var address, provider, box;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                address = new _ethers.ethers.Wallet(privateKey).address;
                provider = new _trufflePrivatekeyProvider["default"](privateKey, this.jsonRpcUrl);
                _context.next = 4;
                return _box["default"].openBox(address, provider);

              case 4:
                box = _context.sent;
                return _context.abrupt("return", box.openSpace(SPACE_NAME));

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function get3BoxSpace(_x) {
        return _get3BoxSpace.apply(this, arguments);
      }

      return get3BoxSpace;
    }()
  }, {
    key: "get3BoxProfile",
    value: function () {
      var _get3BoxProfile = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(privateKey) {
        var space;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.get3BoxSpace(privateKey);

              case 2:
                space = _context2.sent;
                return _context2.abrupt("return", space["public"].get('walletProfile'));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function get3BoxProfile(_x2) {
        return _get3BoxProfile.apply(this, arguments);
      }

      return get3BoxProfile;
    }()
  }, {
    key: "set3BoxProfile",
    value: function () {
      var _set3BoxProfile = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(_ref) {
        var privateKey, contractAddress, ensName, firstName, lastName, avatarUrl, space, address, walletProfile;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                privateKey = _ref.privateKey, contractAddress = _ref.contractAddress, ensName = _ref.ensName, firstName = _ref.firstName, lastName = _ref.lastName, avatarUrl = _ref.avatarUrl;
                _context3.next = 3;
                return this.get3BoxSpace(privateKey);

              case 3:
                space = _context3.sent;
                address = new _ethers.ethers.Wallet(privateKey).address;
                walletProfile = {
                  address: address,
                  contractAddress: contractAddress,
                  ensName: ensName,
                  firstName: firstName,
                  lastName: lastName,
                  avatarUrl: avatarUrl
                };
                return _context3.abrupt("return", space["public"].set('walletProfile', JSON.stringify(walletProfile)));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function set3BoxProfile(_x3) {
        return _set3BoxProfile.apply(this, arguments);
      }

      return set3BoxProfile;
    }()
  }, {
    key: "claim",
    value: function () {
      var _claim = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(_ref2) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, receiverAddress, campaignId, factoryAddress, linkdropSDK;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                weiAmount = _ref2.weiAmount, tokenAddress = _ref2.tokenAddress, tokenAmount = _ref2.tokenAmount, expirationTime = _ref2.expirationTime, linkKey = _ref2.linkKey, linkdropMasterAddress = _ref2.linkdropMasterAddress, linkdropSignerSignature = _ref2.linkdropSignerSignature, receiverAddress = _ref2.receiverAddress, campaignId = _ref2.campaignId, factoryAddress = _ref2.factoryAddress;
                //
                linkdropSDK = new _sdk2.LinkdropSDK({
                  linkdropMasterAddress: linkdropMasterAddress,
                  chain: this.chain,
                  jsonRpcUrl: this.jsonRpcUrl,
                  apiHost: "https://".concat(this.chain, ".linkdrop.io"),
                  factoryAddress: factoryAddress
                });
                return _context4.abrupt("return", linkdropSDK.claim({
                  weiAmount: weiAmount,
                  tokenAddress: tokenAddress,
                  tokenAmount: tokenAmount,
                  expirationTime: expirationTime,
                  linkKey: linkKey,
                  linkdropSignerSignature: linkdropSignerSignature,
                  receiverAddress: receiverAddress,
                  campaignId: campaignId
                }));

              case 3:
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
    key: "_fetchFutureWalletFactory",
    value: function () {
      var _fetchFutureWalletFactory2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5() {
        var futureWalletConfig;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.sdk.getRelayerConfig();

              case 2:
                (0, _commons.ensureNotNull)(this.sdk.relayerConfig, Error, 'Relayer configuration not yet loaded');
                futureWalletConfig = {
                  supportedTokens: this.sdk.relayerConfig.supportedTokens,
                  factoryAddress: this.sdk.relayerConfig.factoryAddress,
                  contractWhiteList: this.sdk.relayerConfig.contractWhiteList,
                  chainSpec: this.sdk.relayerConfig.chainSpec
                };
                this.sdk.futureWalletFactory = this.sdk.futureWalletFactory || new _FutureWalletFactory.FutureWalletFactory(futureWalletConfig, this.sdk.provider, this.sdk.blockchainService, this.sdk.relayerApi);

              case 5:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function _fetchFutureWalletFactory() {
        return _fetchFutureWalletFactory2.apply(this, arguments);
      }

      return _fetchFutureWalletFactory;
    }()
  }, {
    key: "computeProxyAddress",
    value: function () {
      var _computeProxyAddress = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(publicKey) {
        var factoryAddress, initCode;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._fetchFutureWalletFactory();

              case 2:
                factoryAddress = this.sdk.futureWalletFactory.config.factoryAddress;
                _context6.next = 5;
                return this.sdk.futureWalletFactory.blockchainService.getInitCode(factoryAddress);

              case 5:
                initCode = _context6.sent;
                return _context6.abrupt("return", (0, _commons.computeContractAddress)(factoryAddress, publicKey, initCode));

              case 7:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function computeProxyAddress(_x5) {
        return _computeProxyAddress.apply(this, arguments);
      }

      return computeProxyAddress;
    }()
  }, {
    key: "createFutureWallet",
    value: function () {
      var _createFutureWallet = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9() {
        var _this = this;

        var _ref3, _ref4, privateKey, contractAddress, publicKey, waitForBalance, deploy;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this._fetchFutureWalletFactory();

              case 2:
                _context9.next = 4;
                return this.sdk.futureWalletFactory.blockchainService.createFutureWallet(this.sdk.futureWalletFactory.config.factoryAddress);

              case 4:
                _ref3 = _context9.sent;
                _ref4 = (0, _slicedToArray2["default"])(_ref3, 3);
                privateKey = _ref4[0];
                contractAddress = _ref4[1];
                publicKey = _ref4[2];

                waitForBalance =
                /*#__PURE__*/
                function () {
                  var _ref5 = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee7() {
                    return _regenerator["default"].wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            return _context7.abrupt("return", new Promise(function (resolve) {
                              var onReadyToDeploy = function onReadyToDeploy(tokenAddress, contractAddress) {
                                return resolve({
                                  tokenAddress: tokenAddress,
                                  contractAddress: contractAddress
                                });
                              };

                              var deploymentReadyObserver = new _DeploymentReadyObserver.DeploymentReadyObserver(_this.sdk.futureWalletFactory.config.supportedTokens, _this.sdk.futureWalletFactory.provider);
                              deploymentReadyObserver.startAndSubscribe(contractAddress, onReadyToDeploy);
                            }));

                          case 1:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7);
                  }));

                  return function waitForBalance() {
                    return _ref5.apply(this, arguments);
                  };
                }();

                deploy =
                /*#__PURE__*/
                function () {
                  var _ref6 = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee8(ensName) {
                    var gasPrice,
                        initData,
                        signature,
                        tx,
                        _args8 = arguments;
                    return _regenerator["default"].wrap(function _callee8$(_context8) {
                      while (1) {
                        switch (_context8.prev = _context8.next) {
                          case 0:
                            gasPrice = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : _commons.DEFAULT_GAS_PRICE;
                            _context8.prev = 1;
                            _context8.next = 4;
                            return _this.sdk.futureWalletFactory.setupInitData(publicKey, ensName, gasPrice);

                          case 4:
                            initData = _context8.sent;
                            _context8.next = 7;
                            return (0, _commons.calculateInitializeSignature)(initData, privateKey);

                          case 7:
                            signature = _context8.sent;
                            _context8.next = 10;
                            return _this.sdk.futureWalletFactory.relayerApi.deploy(publicKey, ensName, gasPrice, signature);

                          case 10:
                            tx = _context8.sent;
                            return _context8.abrupt("return", {
                              success: true,
                              txHash: tx.hash
                            });

                          case 14:
                            _context8.prev = 14;
                            _context8.t0 = _context8["catch"](1);
                            return _context8.abrupt("return", {
                              errors: _context8.t0
                            });

                          case 17:
                          case "end":
                            return _context8.stop();
                        }
                      }
                    }, _callee8, null, [[1, 14]]);
                  }));

                  return function deploy(_x6) {
                    return _ref6.apply(this, arguments);
                  };
                }();

                return _context9.abrupt("return", {
                  privateKey: privateKey,
                  contractAddress: contractAddress,
                  publicKey: publicKey,
                  waitForBalance: waitForBalance,
                  deploy: deploy
                });

              case 12:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function createFutureWallet() {
        return _createFutureWallet.apply(this, arguments);
      }

      return createFutureWallet;
    }()
  }, {
    key: "getDeployData",
    value: function () {
      var _getDeployData = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10(_ref7) {
        var privateKey, ensName, _ref7$gasPrice, gasPrice, publicKey, initData, signature;

        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                privateKey = _ref7.privateKey, ensName = _ref7.ensName, _ref7$gasPrice = _ref7.gasPrice, gasPrice = _ref7$gasPrice === void 0 ? _commons.DEFAULT_GAS_PRICE : _ref7$gasPrice;
                _context10.next = 3;
                return this._fetchFutureWalletFactory();

              case 3:
                publicKey = new _ethers.ethers.Wallet(privateKey).address;
                _context10.next = 6;
                return this.sdk.futureWalletFactory.setupInitData(publicKey, ensName, gasPrice);

              case 6:
                initData = _context10.sent;
                _context10.next = 9;
                return (0, _commons.calculateInitializeSignature)(initData, privateKey);

              case 9:
                signature = _context10.sent;
                return _context10.abrupt("return", {
                  initData: initData,
                  signature: signature
                });

              case 11:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function getDeployData(_x7) {
        return _getDeployData.apply(this, arguments);
      }

      return getDeployData;
    }()
  }, {
    key: "getClaimData",
    value: function () {
      var _getClaimData = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee11(_ref8) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkId, linkdropMasterAddress, campaignId, linkdropSignerSignature, receiverAddress, receiverSignature;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                weiAmount = _ref8.weiAmount, tokenAddress = _ref8.tokenAddress, tokenAmount = _ref8.tokenAmount, expirationTime = _ref8.expirationTime, linkId = _ref8.linkId, linkdropMasterAddress = _ref8.linkdropMasterAddress, campaignId = _ref8.campaignId, linkdropSignerSignature = _ref8.linkdropSignerSignature, receiverAddress = _ref8.receiverAddress, receiverSignature = _ref8.receiverSignature;
                return _context11.abrupt("return", new _ethers.ethers.utils.Interface(_LinkdropFactory["default"].abi).functions.claim.encode([weiAmount, tokenAddress, tokenAmount, expirationTime, linkId, linkdropMasterAddress, campaignId, linkdropSignerSignature, receiverAddress, receiverSignature]));

              case 2:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function getClaimData(_x8) {
        return _getClaimData.apply(this, arguments);
      }

      return getClaimData;
    }()
  }, {
    key: "deploy",
    value: function () {
      var _deploy = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee12(privateKey, ensName) {
        var gasPrice,
            publicKey,
            initData,
            signature,
            tx,
            _args12 = arguments;
        return _regenerator["default"].wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                gasPrice = _args12.length > 2 && _args12[2] !== undefined ? _args12[2] : _commons.DEFAULT_GAS_PRICE;
                _context12.prev = 1;
                console.log('privateKey', privateKey);
                console.log('ensName', ensName);
                _context12.next = 6;
                return this._fetchFutureWalletFactory();

              case 6:
                publicKey = new _ethers.ethers.Wallet(privateKey).address;
                console.log('publicKey: ', publicKey);
                console.log('gasPrice: ', gasPrice);
                _context12.next = 11;
                return this.sdk.futureWalletFactory.setupInitData(publicKey, ensName, gasPrice);

              case 11:
                initData = _context12.sent;
                console.log('initData: ', initData);
                _context12.next = 15;
                return (0, _commons.calculateInitializeSignature)(initData, privateKey);

              case 15:
                signature = _context12.sent;
                console.log('signature: ', signature);
                _context12.next = 19;
                return this.sdk.futureWalletFactory.relayerApi.deploy(publicKey, ensName, gasPrice, signature);

              case 19:
                tx = _context12.sent;
                console.log('tx: ', tx);
                return _context12.abrupt("return", {
                  success: true,
                  txHash: tx.hash
                });

              case 24:
                _context12.prev = 24;
                _context12.t0 = _context12["catch"](1);
                console.log('ERR420', _context12.t0);
                return _context12.abrupt("return", {
                  errors: _context12.t0
                });

              case 28:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[1, 24]]);
      }));

      function deploy(_x9, _x10) {
        return _deploy.apply(this, arguments);
      }

      return deploy;
    }()
  }, {
    key: "claimAndDeploy",
    value: function () {
      var _claimAndDeploy2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee13(_ref9, _ref10) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, _ref9$factoryAddress, factoryAddress, privateKey, ensName, _ref10$gasPrice, gasPrice, linkdropSDK, publicKey, contractAddress, initializeWithENS, signature, claimAndDeployParams;

        return _regenerator["default"].wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                weiAmount = _ref9.weiAmount, tokenAddress = _ref9.tokenAddress, tokenAmount = _ref9.tokenAmount, expirationTime = _ref9.expirationTime, linkKey = _ref9.linkKey, linkdropMasterAddress = _ref9.linkdropMasterAddress, linkdropSignerSignature = _ref9.linkdropSignerSignature, campaignId = _ref9.campaignId, _ref9$factoryAddress = _ref9.factoryAddress, factoryAddress = _ref9$factoryAddress === void 0 ? '0xBa051891B752ecE3670671812486fe8dd34CC1c8' : _ref9$factoryAddress;
                privateKey = _ref10.privateKey, ensName = _ref10.ensName, _ref10$gasPrice = _ref10.gasPrice, gasPrice = _ref10$gasPrice === void 0 ? _ethers.ethers.utils.parseUnits('5', 'gwei').toString() : _ref10$gasPrice;
                linkdropSDK = new _sdk2.LinkdropSDK({
                  linkdropMasterAddress: linkdropMasterAddress,
                  chain: this.chain,
                  jsonRpcUrl: this.jsonRpcUrl,
                  apiHost: "https://".concat(this.chain, ".linkdrop.io"),
                  factoryAddress: factoryAddress
                });
                _context13.next = 5;
                return this._fetchFutureWalletFactory();

              case 5:
                publicKey = new _ethers.ethers.Wallet(privateKey).address;
                _context13.next = 8;
                return this.computeProxyAddress(publicKey);

              case 8:
                contractAddress = _context13.sent;
                _context13.next = 11;
                return this.sdk.futureWalletFactory.setupInitData(publicKey, ensName, gasPrice);

              case 11:
                initializeWithENS = _context13.sent;
                _context13.next = 14;
                return (0, _commons.calculateInitializeSignature)(initializeWithENS, privateKey);

              case 14:
                signature = _context13.sent;
                _context13.t0 = linkdropSDK.jsonRpcUrl;
                _context13.t1 = linkdropSDK.apiHost;
                _context13.t2 = weiAmount;
                _context13.t3 = tokenAddress;
                _context13.t4 = tokenAmount;
                _context13.t5 = expirationTime;
                _context13.t6 = linkdropSDK.version[campaignId];

                if (_context13.t6) {
                  _context13.next = 26;
                  break;
                }

                _context13.next = 25;
                return linkdropSDK.getVersion(campaignId);

              case 25:
                _context13.t6 = _context13.sent;

              case 26:
                _context13.t7 = _context13.t6;
                _context13.t8 = linkdropSDK.chainId;
                _context13.t9 = linkKey;
                _context13.t10 = linkdropMasterAddress;
                _context13.t11 = linkdropSignerSignature;
                _context13.t12 = campaignId;
                _context13.t13 = contractAddress;
                _context13.t14 = factoryAddress;
                _context13.t15 = this.sdk.futureWalletFactory.config.factoryAddress;
                _context13.t16 = publicKey;
                _context13.t17 = initializeWithENS;
                _context13.t18 = signature;
                claimAndDeployParams = {
                  jsonRpcUrl: _context13.t0,
                  apiHost: _context13.t1,
                  weiAmount: _context13.t2,
                  tokenAddress: _context13.t3,
                  tokenAmount: _context13.t4,
                  expirationTime: _context13.t5,
                  version: _context13.t7,
                  chainId: _context13.t8,
                  linkKey: _context13.t9,
                  linkdropMasterAddress: _context13.t10,
                  linkdropSignerSignature: _context13.t11,
                  campaignId: _context13.t12,
                  receiverAddress: _context13.t13,
                  factoryAddress: _context13.t14,
                  walletFactory: _context13.t15,
                  publicKey: _context13.t16,
                  initializeWithENS: _context13.t17,
                  signature: _context13.t18
                };
                return _context13.abrupt("return", (0, _claimAndDeploy3.claimAndDeploy)(claimAndDeployParams));

              case 40:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function claimAndDeploy(_x11, _x12) {
        return _claimAndDeploy2.apply(this, arguments);
      }

      return claimAndDeploy;
    }()
  }, {
    key: "execute",
    value: function () {
      var _execute = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee14(message, privateKey) {
        var result, messageStatus;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                message = _objectSpread({}, message, {
                  operationType: _commons.OPERATION_CALL,
                  gasToken: _commons.ETHER_NATIVE_TOKEN.address,
                  gasLimit: _ethers.utils.bigNumberify('1000000'),
                  gasPrice: _ethers.utils.bigNumberify(String(20e9))
                });
                console.log({
                  message: message
                });
                _context14.next = 5;
                return this.sdk.execute(message, privateKey);

              case 5:
                result = _context14.sent;
                console.log({
                  result: result
                });
                messageStatus = result.messageStatus;
                return _context14.abrupt("return", {
                  success: true,
                  txHash: messageStatus.messageHash
                });

              case 11:
                _context14.prev = 11;
                _context14.t0 = _context14["catch"](0);
                return _context14.abrupt("return", {
                  errors: _context14.t0,
                  success: false
                });

              case 14:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 11]]);
      }));

      function execute(_x13, _x14) {
        return _execute.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: "walletContractExist",
    value: function () {
      var _walletContractExist = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee15(ensName) {
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                return _context15.abrupt("return", this.sdk.walletContractExist(ensName));

              case 1:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function walletContractExist(_x15) {
        return _walletContractExist.apply(this, arguments);
      }

      return walletContractExist;
    }()
  }]);
  return WalletSDK;
}();

var _default = WalletSDK;
exports["default"] = _default;