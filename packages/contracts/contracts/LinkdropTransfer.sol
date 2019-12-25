pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/ILinkdrop.sol";

/**
* @title Linkdrop contract (Transfer)
* @author Amir Jumaniyazov - <amir@linkdrop.io>
*/
contract LinkdropTransfer is ILinkdrop, ReentrancyGuard {

    using SafeMath for uint;
    using Address for address payable;

    // Owner address
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

    /**
    * @dev Function to verify linkdrop signer's signature
    * @param _linkParams Link params struct
    * @param _signerSignature ECDSA signature of linkdrop signer
    * @return True if signed with valid signer's private key
    */
    function verifySignerSignature
    (
        ILinkdrop.LinkParams memory _linkParams,
        bytes memory _signerSignature
    )
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash
        (
            keccak256
            (
                abi.encodePacked
                (
                    getLinkParamsHash(_linkParams),
                    version,
                    chainId,
                    address(this)
                )
            )
        );
        address signer = ECDSA.recover(prefixedHash, _signerSignature);
        return isSigner[signer];
    }

    /**
    * @dev Function to verify linkdrop receiver's signature
    * @param _linkId Address corresponding to link key
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if signed with link key
    */
    function verifyReceiverSignature
    (
        address _linkId,
        address _receiver,
        bytes memory _receiverSignature
    )
    public pure
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _receiverSignature);
        return signer == _linkId;
    }

    /**
    * @dev Function to verify claim params
    * @param _linkParams Link params struct
    * @param _signerSignature ECDSA signature of linkdrop signer
    * @param _receiver Linkdrop receiver address
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function checkClaimParams
    (
        ILinkdrop.LinkParams memory _linkParams,
        bytes memory _signerSignature,
        address payable _receiver,
        bytes memory _receiverSignature
    )
    public view
    whenNotPaused
    returns (bool)
    {

        // If tokens are being claimed
        if (_linkParams.tokensAmount > 0) {
            require(_linkParams.token != address(0), "INVALID_TOKEN_ADDRESS");
        }

        // Make sure link is not claimed
        require(!isClaimedLink(_linkParams.linkId), "LINK_CLAIMED");

        // Make sure link is not canceled
        require(!isCanceledLink(_linkParams.linkId), "LINK_CANCELED");

        // Make sure link is not expired
        require(_linkParams.expiration >= now, "LINK_EXPIRED"); // solium-disable-line security/no-block-members

        // If fee is being paid in native tokens
        if (_linkParams.feeToken == address(0)) {
            // Make sure native tokens amount is enough to cover both linkdrop and fee costs
            require(address(this).balance >= _linkParams.nativeTokensAmount.add(_linkParams.feeAmount), "INSUFFICIENT_NATIVE_TOKENS");
        }
        // If fee is being paid in ERC20 tokens
        else {
            require(address(this).balance >= _linkParams.nativeTokensAmount, "INSUFFICIENT_NATIVE_TOKENS");
            require(IERC20(_linkParams.feeToken).balanceOf(address(this)) >= _linkParams.feeAmount,"INSUFFICIENT_FEE_TOKENS");
        }

        // Make sure tokens are available for this contract
        if (_linkParams.token != address(0)) {

            if (_linkParams.token == _linkParams.feeToken) {
                require
                (
                    IERC20(_linkParams.token).balanceOf(address(this)) >= _linkParams.tokensAmount.add(_linkParams.feeAmount), "INSUFFICIENT_TOKENS"
                );
            }
            else {
                require
                (
                    IERC20(_linkParams.token).balanceOf(address(this)) >= _linkParams.tokensAmount,
                    "INSUFFICIENT_TOKENS"
                );
            }
        }

        // Make sure nft is available for this contract
        if (_linkParams.nft != address(0)) {
            // Make sure sender owns NFT
            require(IERC721(_linkParams.nft).ownerOf(_linkParams.tokenId) == address(this), "UNAVAILABLE_NFT");
        }

        // Verify that link params are signed by valid signing key
        require(verifySignerSignature(_linkParams, _signerSignature), "INVALID_SIGNER_SIGNATURE");

        // Verify that receiver address is signed by ephemeral link key
        require
        (
            verifyReceiverSignature(_linkParams.linkId, _receiver, _receiverSignature),
            "INVALID_RECEIVER_SIGNATURE"
        );

        return true;
    }

    /**
    * @dev Function to claim linkdrop. Can only be called when contract is not paused
    * @param _linkParams Link params struct
    * @param _signerSignature ECDSA signature of linkdrop signer
    * @param _receiver Linkdrop receiver address
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function claim
    (
        ILinkdrop.LinkParams memory _linkParams,
        bytes memory _signerSignature,
        address payable _receiver,
        bytes memory _receiverSignature
    )
    public
    whenNotPaused
    nonReentrant
    returns (bool)
    {
        // Make sure params are valid
        require
        (
            checkClaimParams
            (
                _linkParams,
                _signerSignature,
                _receiver,
                _receiverSignature
            ),
            "INVALID_CLAIM_PARAMS"
        );

        // Mark link as claimed
        claimedTo[_linkParams.linkId] = _receiver;

        // Execute callback data
        if (_linkParams.data.length != 0) {
            require(_executeCallbackData(_linkParams.data), "CALLBACK_FAILED");
        }

        // Make sure transfer succeeds
        require(_transferFunds(_linkParams, _receiver), "TRANSFER_FAILED");

        // Emit claim event
        emit Claimed(_linkParams.linkId, _linkParams);

        return true;
    }

    /**
    * @dev Internal function to execute callback transactions
    * Each transaction is encoded as a tuple [address to, uint256 value, bytes data]
    * All bytes of encoded transactions are concatenated to form the input
    * @param _callbackData Encoded callback transactions data
    * @return True if success
    */
    function _executeCallbackData
    (
        bytes memory _callbackData
    )
    internal returns (bool)
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            let length := mload(_callbackData)
            let i := 0x20
            for { } lt(i, length) { } {
                let to := mload(add(_callbackData, i))
                let value := mload(add(_callbackData, add(i, 0x20)))
                let dataLength := mload(add(_callbackData, add(i, 0x60)))
                let data := add(_callbackData, add(i, 0x80))
                let success := 0
                success := call(gas, to, value, data, dataLength, 0, 0)
                if eq(success, 0) { revert(0, 0) }
                i := add(i, add(0x80, mul(div(add(dataLength, 0x1f), 0x20), 0x20)))
            }
        }
        return true;
    }

    /**
    * @dev Internal function to handle linkdrop and fee transfer
    * @param _linkParams Link params struct
    * @param _receiver Address to transfer funds to
    * @return True if success
    */
    function _transferFunds
    (
        ILinkdrop.LinkParams memory _linkParams,
        address payable _receiver
    )
    internal returns (bool)
    {

        // solium-disable-next-line
        address payable feeReceiver = _linkParams.feeReceiver == address(0) ? tx.origin : _linkParams.feeReceiver;

        // Transfer fee
        if (_linkParams.feeAmount > 0) {
            if (_linkParams.feeToken == address(0)) {
                feeReceiver.sendValue(_linkParams.feeAmount);
            }
            else {
                IERC20(_linkParams.feeToken).transfer(feeReceiver, _linkParams.feeAmount);
            }
        }

        // Transfer native tokens
        if (_linkParams.nativeTokensAmount > 0) {
            _receiver.sendValue(_linkParams.nativeTokensAmount);
        }

        // Transfer tokens
        if (_linkParams.tokensAmount > 0) {
            IERC20(_linkParams.token).transfer(_receiver, _linkParams.tokensAmount);
        }

        // Transfer NFT
        if (_linkParams.nft != address(0)) {
            IERC721(_linkParams.nft).safeTransferFrom(address(this), _receiver, _linkParams.tokenId);
        }

        return true;
    }

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
        address payable _sender,
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

    modifier onlySenderOrOwner() {
        require (msg.sender == sender || msg.sender == owner, "ONLY_SENDER_OR_OWNER");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
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
    * @dev Function to withdraw all remaining native tokens to sender, can only be called by sender
    * @return True if success
    */
    function withdraw() external onlySender nonReentrant returns (bool) {
        sender.sendValue(address(this).balance);
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
    * @dev Function to add new signing key, can only be called by sender or owner
    * @param _signer Address corresponding to signing key
    * @return True if success
    */
    function addSigner(address _signer) external payable onlySenderOrOwner returns (bool) {
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
    * @dev Function to destroy this contract, can only be called by owner or sender
    * Withdraws all the remaining native tokens to sender
    */
    function destroy() external onlySenderOrOwner {
        selfdestruct(sender);
    }

    /**
    * @dev Function for other contracts to be able to fetch the mastercopy version
    * @return Master copy version
    */
    function getMasterCopyVersion() external view returns (uint) {
        return version;
    }

    /**
    * @dev Function to get link params hash
    * @param _linkParams Link params struct
    * @return Link params hash
    */
    function getLinkParamsHash
    (
        ILinkdrop.LinkParams memory _linkParams
    )
    public pure
    returns (bytes32) 
    {
        return keccak256
        (
            abi.encodePacked
            (
                _linkParams.token,
                _linkParams.nft,
                _linkParams.feeToken,
                _linkParams.feeReceiver,
                _linkParams.linkId,
                _linkParams.nativeTokensAmount,
                _linkParams.tokensAmount,
                _linkParams.tokenId,
                _linkParams.feeAmount,
                _linkParams.expiration,
                _linkParams.data
            )
        );
    }


    /**
    * @dev Fallback function to accept native tokens
    */
    function () external payable {}

}