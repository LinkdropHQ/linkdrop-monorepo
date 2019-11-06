pragma solidity ^0.5.6;
pragma experimental ABIEncoderV2;

import "../interfaces/ILinkdropCommon.sol";
import "../storage/LinkdropStorage.sol";
import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract LinkdropCommon is ILinkdropCommon, LinkdropStorage, ReentrancyGuard {

    using Address for address payable;
    using Address for address;

    /**
    * @dev Function called only once to set owner, sender, contract version and chain id
    * @param _owner Owner address
    * @param _sender Sender address
    * @param _version Contract version
    * @param _chainId Network id
    */
    function initialize
    (
        address _owner,
        address _sender,
        uint _version,
        uint _chainId
    )
    public
    returns (bool)
    {
        require(!initialized, "LINKDROP_PROXY_CONTRACT_ALREADY_INITIALIZED");
        owner = _owner;
        sender = _sender;
        isSigner[sender] = true;
        version = _version;
        chainId = _chainId;
        initialized = true;
        return true;
    }

    modifier onlySender() {
        require(msg.sender == sender, "ONLY_SENDER");
        _;
    }

    modifier onlySenderOrFactory() {
        require (msg.sender == sender || msg.sender == owner, "ONLY_SENDER_OR_FACTORY");
        _;
    }

    modifier onlyFactory() {
        require(msg.sender == owner, "ONLY_FACTORY");
        _;
    }

    modifier whenNotPaused() {
        require(!paused(), "LINKDROP_PROXY_CONTRACT_PAUSED");
        _;
    }

    /**
    * @dev Indicates whether a link is claimed or not
    * @param _linkId Address corresponding to link key
    * @return True if claimed
    */
    function isClaimedLink(address _linkId) public view returns (bool) {
        return claimedTo[_linkId] != address(0);
    }

    /**
    * @dev Indicates whether a link is canceled or not
    * @param _linkId Address corresponding to link key
    * @return True if canceled
    */
    function isCanceledLink(address _linkId) public view returns (bool) {
        return _canceled[_linkId];
    }

    /**
    * @dev Indicates whether a contract is paused or not
    * @return True if paused
    */
    function paused() public view returns (bool) {
        return _paused;
    }

    /**
    * @dev Function to cancel a link, can only be called by sender
    * @param _linkId Address corresponding to link key
    * @return True if success
    */
    function cancel(address _linkId) external onlySender returns (bool) {
        require(!isClaimedLink(_linkId), "LINK_CLAIMED");
        _canceled[_linkId] = true;
        emit Canceled(_linkId);
        return true;
    }

    /**
    * @dev Function to withdraw all remaining eth to sender, can only be called by sender
    * @return True if success
    */
    function withdraw() external onlySender nonReentrant returns (bool) {
        sender.toPayable().sendValue(address(this).balance);
        return true;
    }

    /**
    * @dev Function to pause contract, can only be called by sender
    * @return True if success
    */
    function pause() external onlySender whenNotPaused returns (bool) {
        _paused = true;
        emit Paused();
        return true;
    }

    /**
    * @dev Function to unpause contract, can only be called by sender
    * @return True if success
    */
    function unpause() external onlySender returns (bool) {
        require(paused(), "LINKDROP_CONTRACT_ALREADY_UNPAUSED");
        _paused = false;
        emit Unpaused();
        return true;
    }

    /**
    * @dev Function to add new signing key, can only be called by sender or owner (factory contract)
    * @param _signer Address corresponding to signing key
    * @return True if success
    */
    function addSigner(address _signer) external payable onlySenderOrFactory returns (bool) {
        require(_signer != address(0), "INVALID_SIGNER_ADDRESS");
        isSigner[_signer] = true;
        return true;
    }

    /**
    * @dev Function to remove signing key, can only be called by sender
    * @param _signer Address corresponding to signing key
    * @return True if success
    */
    function removeSigner(address _signer) external onlySender returns (bool) {
        require(_signer != address(0), "INVALID_SIGNER_ADDRESS");
        isSigner[_signer] = false;
        return true;
    }

    /**
    * @dev Function to destroy this contract, can only be called by owner (factory) or sender
    * Withdraws all the remaining eth to sender
    */
    function destroy() external onlySenderOrFactory {
        selfdestruct(sender.toPayable());
    }

    /**
    * @dev Function for other contracts to be able to fetch the mastercopy version
    * @return Master copy version
    */
    function getMasterCopyVersion() external view returns (uint) {
        return version;
    }

    /**
    * @dev Fallback function to accept eth
    */
    function () external payable {}

}