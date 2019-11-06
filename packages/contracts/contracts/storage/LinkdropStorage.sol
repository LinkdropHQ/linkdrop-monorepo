pragma solidity ^0.5.10;
pragma experimental ABIEncoderV2;

contract LinkdropStorage {

    // /*
    // * @param _nativeTokensAmount Amount of native tokens to be claimed
    // * @param _token ERC20 token address
    // * @param _tokensAmount Amount of tokens to be claimed
    // * @param _feeToken Fee token address (0x0 for native token)
    // * @param _feeAmount Fee amount
    // * @param _feeReceiver Fee receiver address
    // * @param _expiration Link expiration unix timestamp
    // * @param _linkId Address corresponding to link key
    // * @param _signerSignature ECDSA signature of linkdrop signer
    // */
    struct LinkParams {
        address token;
        address feeToken;
        address feeReceiver;
        address linkId;
        uint nativeTokensAmount;
        uint tokensAmount;
        uint feeAmount;
        uint expiration;
        bytes signerSignature;
    }

    // Owner address (factory)
    address public owner;

    // Sender address
    address public sender;

    // Mastercopy version
    uint public version;

    // Chain id
    uint public chainId;

    // Indicates whether an address corresponds to signing key
    mapping (address => bool) public isSigner;

    // Indicates where the link is claimed to
    mapping (address => address) public claimedTo;

    // Indicates whether the link is canceled or not
    mapping (address => bool) internal _canceled;

    // Indicates whether the initializer function has been called or not
    bool public initialized;

    // Indicates whether the contract is paused or not
    bool internal _paused;

    // Events
    event Canceled(address linkId);

    event Claimed(address indexed linkId, LinkParams linkParams);
    event ClaimedERC721(address indexed linkId, uint ethAmount, address indexed nft, uint tokenId, address receiver);
    event Paused();
    event Unpaused();
    event AddedSigningKey(address signer);
    event RemovedSigningKey(address signer);

}