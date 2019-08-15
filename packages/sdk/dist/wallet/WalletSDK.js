"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _sdk = _interopRequireDefault(require("@universal-login/sdk"));

var _sdk2 = require("@linkdrop/sdk");

var _DeploymentReadyObserver = require("@universal-login/sdk/dist/lib/core/observers/DeploymentReadyObserver");

var _FutureWalletFactory = require("@universal-login/sdk/dist/lib/api/FutureWalletFactory");

var _commons = require("@universal-login/commons");

var _ethers = require("ethers");

var _claimAndDeploy3 = require("./claimAndDeploy");

var _utils = require("../../../scripts/src/utils");

var LINKDROP_FACTORY_ADDRESS = (0, _utils.getString)('FACTORY_ADDRESS');

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
    this.sdk = new _sdk["default"]('http://rinkeby.linkdrop.io:11004', this.jsonRpcUrl);
  }

  (0, _createClass2["default"])(WalletSDK, [{
    key: "claim",
    value: function () {
      var _claim = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(_ref) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, receiverAddress, campaignId, linkdropSDK;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, linkKey = _ref.linkKey, linkdropMasterAddress = _ref.linkdropMasterAddress, linkdropSignerSignature = _ref.linkdropSignerSignature, receiverAddress = _ref.receiverAddress, campaignId = _ref.campaignId;
                //
                linkdropSDK = new _sdk2.LinkdropSDK({
                  linkdropMasterAddress: linkdropMasterAddress,
                  chain: this.chain,
                  jsonRpcUrl: this.jsonRpcUrl,
                  apiHost: "https://".concat(this.chain, ".linkdrop.io"),
                  factoryAddress: LINKDROP_FACTORY_ADDRESS
                });
                return _context.abrupt("return", linkdropSDK.claim({
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
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function claim(_x) {
        return _claim.apply(this, arguments);
      }

      return claim;
    }()
  }, {
    key: "_fetchFutureWalletFactory",
    value: function () {
      var _fetchFutureWalletFactory2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        var futureWalletConfig;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
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
                return _context2.stop();
            }
          }
        }, _callee2, this);
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
      _regenerator["default"].mark(function _callee3(publicKey) {
        var factoryAddress, initCode;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this._fetchFutureWalletFactory();

              case 2:
                factoryAddress = this.sdk.futureWalletFactory.config.factoryAddress;
                _context3.next = 5;
                return this.sdk.futureWalletFactory.blockchainService.getInitCode(factoryAddress);

              case 5:
                initCode = _context3.sent;
                return _context3.abrupt("return", (0, _commons.computeContractAddress)(factoryAddress, publicKey, initCode));

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function computeProxyAddress(_x2) {
        return _computeProxyAddress.apply(this, arguments);
      }

      return computeProxyAddress;
    }()
  }, {
    key: "createFutureWallet",
    value: function () {
      var _createFutureWallet = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6() {
        var _this = this;

        var _ref2, _ref3, privateKey, contractAddress, publicKey, waitForBalance, deploy;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this._fetchFutureWalletFactory();

              case 2:
                _context6.next = 4;
                return this.sdk.futureWalletFactory.blockchainService.createFutureWallet(this.sdk.futureWalletFactory.config.factoryAddress);

              case 4:
                _ref2 = _context6.sent;
                _ref3 = (0, _slicedToArray2["default"])(_ref2, 3);
                privateKey = _ref3[0];
                contractAddress = _ref3[1];
                publicKey = _ref3[2];

                waitForBalance =
                /*#__PURE__*/
                function () {
                  var _ref4 = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee4() {
                    return _regenerator["default"].wrap(function _callee4$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            return _context4.abrupt("return", new Promise(function (resolve) {
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
                            return _context4.stop();
                        }
                      }
                    }, _callee4);
                  }));

                  return function waitForBalance() {
                    return _ref4.apply(this, arguments);
                  };
                }();

                deploy =
                /*#__PURE__*/
                function () {
                  var _ref5 = (0, _asyncToGenerator2["default"])(
                  /*#__PURE__*/
                  _regenerator["default"].mark(function _callee5(ensName) {
                    var gasPrice,
                        initData,
                        signature,
                        tx,
                        _args5 = arguments;
                    return _regenerator["default"].wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            gasPrice = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : _commons.DEFAULT_GAS_PRICE;
                            _context5.prev = 1;
                            _context5.next = 4;
                            return _this.sdk.futureWalletFactory.setupInitData(publicKey, ensName, gasPrice);

                          case 4:
                            initData = _context5.sent;
                            _context5.next = 7;
                            return (0, _commons.calculateInitializeSignature)(initData, privateKey);

                          case 7:
                            signature = _context5.sent;
                            _context5.next = 10;
                            return _this.sdk.futureWalletFactory.relayerApi.deploy(publicKey, ensName, gasPrice, signature);

                          case 10:
                            tx = _context5.sent;
                            return _context5.abrupt("return", {
                              success: true,
                              txHash: tx.hash
                            });

                          case 14:
                            _context5.prev = 14;
                            _context5.t0 = _context5["catch"](1);
                            return _context5.abrupt("return", {
                              errors: _context5.t0
                            });

                          case 17:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5, null, [[1, 14]]);
                  }));

                  return function deploy(_x3) {
                    return _ref5.apply(this, arguments);
                  };
                }();

                return _context6.abrupt("return", {
                  privateKey: privateKey,
                  contractAddress: contractAddress,
                  publicKey: publicKey,
                  waitForBalance: waitForBalance,
                  deploy: deploy
                });

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function createFutureWallet() {
        return _createFutureWallet.apply(this, arguments);
      }

      return createFutureWallet;
    }()
  }, {
    key: "deploy",
    value: function () {
      var _deploy = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(privateKey, ensName) {
        var gasPrice,
            publicKey,
            initData,
            signature,
            tx,
            _args7 = arguments;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                gasPrice = _args7.length > 2 && _args7[2] !== undefined ? _args7[2] : _commons.DEFAULT_GAS_PRICE;
                _context7.prev = 1;
                _context7.next = 4;
                return this._fetchFutureWalletFactory();

              case 4:
                publicKey = new _ethers.ethers.Wallet(privateKey).address;
                _context7.next = 7;
                return this.sdk.futureWalletFactory.setupInitData(publicKey, ensName, gasPrice);

              case 7:
                initData = _context7.sent;
                _context7.next = 10;
                return (0, _commons.calculateInitializeSignature)(initData, privateKey);

              case 10:
                signature = _context7.sent;
                _context7.next = 13;
                return this.sdk.futureWalletFactory.relayerApi.deploy(publicKey, ensName, gasPrice, signature);

              case 13:
                tx = _context7.sent;
                return _context7.abrupt("return", {
                  success: true,
                  txHash: tx.hash
                });

              case 17:
                _context7.prev = 17;
                _context7.t0 = _context7["catch"](1);
                return _context7.abrupt("return", {
                  errors: _context7.t0
                });

              case 20:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[1, 17]]);
      }));

      function deploy(_x4, _x5) {
        return _deploy.apply(this, arguments);
      }

      return deploy;
    }()
  }, {
    key: "claimAndDeploy",
    value: function () {
      var _claimAndDeploy2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8(_ref6, _ref7) {
        var weiAmount, tokenAddress, tokenAmount, expirationTime, linkKey, linkdropMasterAddress, linkdropSignerSignature, campaignId, privateKey, ensName, _ref7$gasPrice, gasPrice, linkdropSDK, publicKey, contractAddress, initData, signature;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                weiAmount = _ref6.weiAmount, tokenAddress = _ref6.tokenAddress, tokenAmount = _ref6.tokenAmount, expirationTime = _ref6.expirationTime, linkKey = _ref6.linkKey, linkdropMasterAddress = _ref6.linkdropMasterAddress, linkdropSignerSignature = _ref6.linkdropSignerSignature, campaignId = _ref6.campaignId;
                privateKey = _ref7.privateKey, ensName = _ref7.ensName, _ref7$gasPrice = _ref7.gasPrice, gasPrice = _ref7$gasPrice === void 0 ? 5e9 : _ref7$gasPrice;
                linkdropSDK = new _sdk2.LinkdropSDK({
                  linkdropMasterAddress: linkdropMasterAddress,
                  chain: this.chain,
                  jsonRpcUrl: this.jsonRpcUrl,
                  apiHost: "https://".concat(this.chain, ".linkdrop.io"),
                  factoryAddress: LINKDROP_FACTORY_ADDRESS
                });
                _context8.next = 5;
                return this._fetchFutureWalletFactory();

              case 5:
                publicKey = new _ethers.ethers.Wallet(privateKey).address;
                _context8.next = 8;
                return this.computeProxyAddress(publicKey);

              case 8:
                contractAddress = _context8.sent;
                _context8.next = 11;
                return this.sdk.futureWalletFactory.setupInitData(publicKey, ensName, gasPrice);

              case 11:
                initData = _context8.sent;
                _context8.next = 14;
                return (0, _commons.calculateInitializeSignature)(initData, privateKey);

              case 14:
                signature = _context8.sent;
                _context8.t0 = _claimAndDeploy3.claimAndDeploy;
                _context8.t1 = linkdropSDK.jsonRpcUrl;
                _context8.t2 = linkdropSDK.apiHost;
                _context8.t3 = weiAmount;
                _context8.t4 = tokenAddress;
                _context8.t5 = tokenAmount;
                _context8.t6 = expirationTime;
                _context8.t7 = linkdropSDK.version[campaignId];

                if (_context8.t7) {
                  _context8.next = 27;
                  break;
                }

                _context8.next = 26;
                return linkdropSDK.getVersion(campaignId);

              case 26:
                _context8.t7 = _context8.sent;

              case 27:
                _context8.t8 = _context8.t7;
                _context8.t9 = linkdropSDK.chainId;
                _context8.t10 = linkKey;
                _context8.t11 = linkdropMasterAddress;
                _context8.t12 = linkdropSignerSignature;
                _context8.t13 = campaignId;
                _context8.t14 = contractAddress;
                _context8.t15 = LINKDROP_FACTORY_ADDRESS;
                _context8.t16 = this.sdk.futureWalletFactory.config.factoryAddress;
                _context8.t17 = publicKey;
                _context8.t18 = initData;
                _context8.t19 = signature;
                _context8.t20 = {
                  jsonRpcUrl: _context8.t1,
                  apiHost: _context8.t2,
                  weiAmount: _context8.t3,
                  tokenAddress: _context8.t4,
                  tokenAmount: _context8.t5,
                  expirationTime: _context8.t6,
                  version: _context8.t8,
                  chainId: _context8.t9,
                  linkKey: _context8.t10,
                  linkdropMasterAddress: _context8.t11,
                  linkdropSignerSignature: _context8.t12,
                  campaignId: _context8.t13,
                  receiverAddress: _context8.t14,
                  factoryAddress: _context8.t15,
                  walletFactory: _context8.t16,
                  publicKey: _context8.t17,
                  initializeWithENS: _context8.t18,
                  signature: _context8.t19
                };
                return _context8.abrupt("return", (0, _context8.t0)(_context8.t20));

              case 41:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function claimAndDeploy(_x6, _x7) {
        return _claimAndDeploy2.apply(this, arguments);
      }

      return claimAndDeploy;
    }()
  }, {
    key: "execute",
    value: function () {
      var _execute = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9(message, privateKey) {
        var _ref8, messageStatus;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.prev = 0;
                _context9.next = 3;
                return this.sdk.execute(message, privateKey);

              case 3:
                _ref8 = _context9.sent;
                messageStatus = _ref8.messageStatus;
                return _context9.abrupt("return", {
                  success: true,
                  txHash: messageStatus.transactionHash
                });

              case 8:
                _context9.prev = 8;
                _context9.t0 = _context9["catch"](0);
                return _context9.abrupt("return", {
                  errors: _context9.t0
                });

              case 11:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[0, 8]]);
      }));

      function execute(_x8, _x9) {
        return _execute.apply(this, arguments);
      }

      return execute;
    }()
  }, {
    key: "walletContractExist",
    value: function () {
      var _walletContractExist = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee10(ensName) {
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                return _context10.abrupt("return", this.sdk.walletContractExist(ensName));

              case 1:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function walletContractExist(_x10) {
        return _walletContractExist.apply(this, arguments);
      }

      return walletContractExist;
    }()
  }]);
  return WalletSDK;
}();

var _default = WalletSDK;
exports["default"] = _default;