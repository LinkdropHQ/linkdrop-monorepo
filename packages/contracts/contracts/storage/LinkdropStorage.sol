pragma solidity ^0.5.6;

contract LinkdropStorage {

    // Owner address (factory)
    address public owner;

    // Sender address
    address payable public sender;

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
    event Claimed(address indexed linkId, uint ethAmount, address indexed token, uint tokenAmount, address receiver);
    event ClaimedERC721(address indexed linkId, uint ethAmount, address indexed nft, uint tokenId, address receiver);
    event Paused();
    event Unpaused();
    event AddedSigningKey(address signer);
    event RemovedSigningKey(address signer);

}