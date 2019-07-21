"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateAccount = exports.signReceiverAddress = exports.signLinkERC721 = exports.createLinkERC721 = exports.signLink = exports.createLink = exports.computeProxyAddress = exports.computeBytecode = exports.buildCreate2Address = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var ethers = require('ethers');

var Wallet = require('ethereumjs-wallet'); // Turn off annoying warnings


ethers.errors.setLogLevel('error');

var buildCreate2Address = function buildCreate2Address(creatorAddress, saltHex, byteCode) {
  var byteCodeHash = ethers.utils.keccak256(byteCode);
  return "0x".concat(ethers.utils.keccak256("0x".concat(['ff', creatorAddress, saltHex, byteCodeHash].map(function (x) {
    return x.replace(/0x/, '');
  }).join(''))).slice(-40)).toLowerCase();
};

exports.buildCreate2Address = buildCreate2Address;

var computeBytecode = function computeBytecode(masterCopyAddress) {
  var bytecode = "0x363d3d373d3d3d363d73".concat(masterCopyAddress.slice(2), "5af43d82803e903d91602b57fd5bf3");
  return bytecode;
};

exports.computeBytecode = computeBytecode;

var computeProxyAddress = function computeProxyAddress(factoryAddress, linkdropMasterAddress, campaignId) {
  if (factoryAddress == null || factoryAddress === '') {
    throw new Error('Please provide factory address');
  }

  if (linkdropMasterAddress == null || linkdropMasterAddress === '') {
    throw new Error('Please provide linkdrop master address');
  }

  if (campaignId == null || campaignId === '') {
    throw new Error('Please provide campaign id');
  }

  var salt = ethers.utils.solidityKeccak256(['address', 'uint256'], [linkdropMasterAddress, campaignId]);
  var initcode = '0x6352c7420d6000526103ff60206004601c335afa6040516060f3';
  var proxyAddress = buildCreate2Address(factoryAddress, salt, initcode);
  return proxyAddress;
}; // Generates new link for ETH and ERC20


exports.computeProxyAddress = computeProxyAddress;

var createLink =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(_ref) {
    var linkdropSigner, weiAmount, tokenAddress, tokenAmount, expirationTime, version, chainId, proxyAddress, _generateAccount, linkId, linkKey, linkdropSignerSignature;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            linkdropSigner = _ref.linkdropSigner, weiAmount = _ref.weiAmount, tokenAddress = _ref.tokenAddress, tokenAmount = _ref.tokenAmount, expirationTime = _ref.expirationTime, version = _ref.version, chainId = _ref.chainId, proxyAddress = _ref.proxyAddress;
            _generateAccount = generateAccount(), linkId = _generateAccount.address, linkKey = _generateAccount.privateKey;
            _context.next = 4;
            return signLink({
              linkdropSigner: linkdropSigner,
              weiAmount: weiAmount,
              tokenAddress: tokenAddress,
              tokenAmount: tokenAmount,
              expirationTime: expirationTime,
              version: version,
              chainId: chainId,
              linkId: linkId,
              proxyAddress: proxyAddress
            });

          case 4:
            linkdropSignerSignature = _context.sent;
            return _context.abrupt("return", {
              linkKey: linkKey,
              // link's ephemeral private key
              linkId: linkId,
              // address corresponding to link key
              linkdropSignerSignature: linkdropSignerSignature // signed by linkdrop verifier

            });

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function createLink(_x) {
    return _ref2.apply(this, arguments);
  };
}(); // Should be signed by linkdropSigner (ETH, ERC20)


exports.createLink = createLink;

var signLink =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(_ref3) {
    var linkdropSigner, weiAmount, tokenAddress, tokenAmount, expirationTime, version, chainId, linkId, proxyAddress, messageHash, messageHashToSign, signature;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            linkdropSigner = _ref3.linkdropSigner, weiAmount = _ref3.weiAmount, tokenAddress = _ref3.tokenAddress, tokenAmount = _ref3.tokenAmount, expirationTime = _ref3.expirationTime, version = _ref3.version, chainId = _ref3.chainId, linkId = _ref3.linkId, proxyAddress = _ref3.proxyAddress;
            messageHash = ethers.utils.solidityKeccak256(['uint', 'address', 'uint', 'uint', 'uint', 'uint', 'address', 'address'], [weiAmount, tokenAddress, tokenAmount, expirationTime, version, chainId, linkId, proxyAddress]);
            messageHashToSign = ethers.utils.arrayify(messageHash);
            _context2.next = 5;
            return linkdropSigner.signMessage(messageHashToSign);

          case 5:
            signature = _context2.sent;
            return _context2.abrupt("return", signature);

          case 7:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function signLink(_x2) {
    return _ref4.apply(this, arguments);
  };
}(); // Generates new link for ERC721


exports.signLink = signLink;

var createLinkERC721 =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(_ref5) {
    var linkdropSigner, weiAmount, nftAddress, tokenId, expirationTime, version, chainId, proxyAddress, _generateAccount2, linkId, linkKey, linkdropSignerSignature;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            linkdropSigner = _ref5.linkdropSigner, weiAmount = _ref5.weiAmount, nftAddress = _ref5.nftAddress, tokenId = _ref5.tokenId, expirationTime = _ref5.expirationTime, version = _ref5.version, chainId = _ref5.chainId, proxyAddress = _ref5.proxyAddress;
            _generateAccount2 = generateAccount(), linkId = _generateAccount2.address, linkKey = _generateAccount2.privateKey;
            _context3.next = 4;
            return signLinkERC721({
              linkdropSigner: linkdropSigner,
              weiAmount: weiAmount,
              nftAddress: nftAddress,
              tokenId: tokenId,
              expirationTime: expirationTime,
              version: version,
              chainId: chainId,
              linkId: linkId,
              proxyAddress: proxyAddress
            });

          case 4:
            linkdropSignerSignature = _context3.sent;
            return _context3.abrupt("return", {
              linkKey: linkKey,
              // link's ephemeral private key
              linkId: linkId,
              // address corresponding to link key
              linkdropSignerSignature: linkdropSignerSignature // signed by linkdrop verifier

            });

          case 6:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function createLinkERC721(_x3) {
    return _ref6.apply(this, arguments);
  };
}(); // Should be signed by linkdropSigner (ERC721)


exports.createLinkERC721 = createLinkERC721;

var signLinkERC721 =
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(_ref7) {
    var linkdropSigner, weiAmount, nftAddress, tokenId, expirationTime, version, chainId, linkId, proxyAddress, messageHash, messageHashToSign, signature;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            linkdropSigner = _ref7.linkdropSigner, weiAmount = _ref7.weiAmount, nftAddress = _ref7.nftAddress, tokenId = _ref7.tokenId, expirationTime = _ref7.expirationTime, version = _ref7.version, chainId = _ref7.chainId, linkId = _ref7.linkId, proxyAddress = _ref7.proxyAddress;
            messageHash = ethers.utils.solidityKeccak256(['uint', 'address', 'uint', 'uint', 'uint', 'uint', 'address', 'address'], [weiAmount, nftAddress, tokenId, expirationTime, version, chainId, linkId, proxyAddress]);
            messageHashToSign = ethers.utils.arrayify(messageHash);
            _context4.next = 5;
            return linkdropSigner.signMessage(messageHashToSign);

          case 5:
            signature = _context4.sent;
            return _context4.abrupt("return", signature);

          case 7:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function signLinkERC721(_x4) {
    return _ref8.apply(this, arguments);
  };
}();

exports.signLinkERC721 = signLinkERC721;

var signReceiverAddress =
/*#__PURE__*/
function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(linkKey, receiverAddress) {
    var wallet, messageHash, messageHashToSign, signature;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            wallet = new ethers.Wallet(linkKey);
            messageHash = ethers.utils.solidityKeccak256(['address'], [receiverAddress]);
            messageHashToSign = ethers.utils.arrayify(messageHash);
            _context5.next = 5;
            return wallet.signMessage(messageHashToSign);

          case 5:
            signature = _context5.sent;
            return _context5.abrupt("return", signature);

          case 7:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));

  return function signReceiverAddress(_x5, _x6) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * Function to generate new account
 * @return {Object} `{address, privateKey}`
 */


exports.signReceiverAddress = signReceiverAddress;

var generateAccount = function generateAccount() {
  var wallet = Wallet.generate();
  var address = wallet.getChecksumAddressString();
  var privateKey = wallet.getPrivateKeyString();
  return {
    address: address,
    privateKey: privateKey
  };
};

exports.generateAccount = generateAccount;