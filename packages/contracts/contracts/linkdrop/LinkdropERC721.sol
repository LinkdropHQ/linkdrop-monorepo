pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./LinkdropCommon.sol";

contract LinkdropERC721 is LinkdropCommon {

    using SafeMath for uint;

  /**
    * @dev Function to verify linkdrop signer's signature
    * @param _linkParams Link params struct
    * @return True if signed with valid signer's private key
    */
    function verifySignerSignatureERC721
    (
        LinkParamsERC721 memory _linkParams
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
                    _linkParams.nft,
                    _linkParams.feeToken,
                    _linkParams.feeReceiver,
                    _linkParams.linkId,
                    _linkParams.nativeTokensAmount,
                    _linkParams.tokenId,
                    _linkParams.feeAmount,
                    _linkParams.expiration,
                    version,
                    chainId,
                    address(this)
                )
            )
        );
        address signer = ECDSA.recover(prefixedHash, _signature);
        return isLinkdropSigner[signer];
    }

    /**
    * @dev Function to verify linkdrop receiver's signature
    * @param _linkId Address corresponding to link key
    * @param _receiver Address of linkdrop receiver
    * @param _signature ECDSA signature of linkdrop receiver
    * @return True if signed with link key
    */
    function verifyReceiverSignatureERC721
    (
        address _linkId,
        address _receiver,
        bytes memory _signature
    )
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _signature);
        return signer == _linkId;
    }

     /**
    * @dev Function to verify claim params
    * @param _linkParams Link params struct
    * @param _receiver Linkdrop receiver address
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function checkClaimParamsERC721
    (
        LinkParamsERC721 memory _linkParams,
        address payable _receiver,
        bytes memory _receiverSignature
    )
    public view
    whenNotPaused
    returns (bool)
    {
        // Make sure nft address is not equal to address(0)
        require(_nftAddress != address(0), "INVALID_NFT_ADDRESS");

        // Make sure link is not claimed
        require(!isClaimedLink(_linkId), "LINK_CLAIMED");

        // Make sure link is not canceled
        require(!isCanceledLink(_linkId), "LINK_CANCELED");

        // Make sure link is not expired
        require(_linkParams.expiration >= now, "LINK_EXPIRED"); //solium-disable-line security/no-block-members

        // If fee is being paid in native tokens
        if (_linkParams.feeToken == address(0)) {
            // Make sure native tokens amount is enough to cover both linkdrop and fee costs
            require(address(this).balance >= _linkParams.nativeTokensAmount.add(_linkParams.feeAmount), "INSUFFICIENT_NATIVE_TOKENS");
        }
        // If fee is being paid in ERC20 tokens
        else {
            require(address(this).balance >= _linkParams.nativeTokensAmount, "INSUFFICIENT_NATIVE_TOKENS");
            require(IERC20(_linkParams.feeToken).balanceOf(sender) >= _linkParams.feeAmount,"INSUFFICIENT_FEE_TOKENS");
            require(IERC20(_linkParams.feeToken).allowance(sender, address(this)) >= _linkParams.feeAmount, "INSUFFICIENT_FEE_TOKENS_ALLOWANCE");
        }

        // Make sure sender owns NFT
        require(IERC721(_linkParams.nft).ownerOf(_linkParams.tokenId) == sender, "SENDER_DOES_NOT_OWN_TOKEN_ID");

        // Make sure NFT is available for this contract
        require(IERC721(_linkParams.nft).isApprovedForAll(sender, address(this)), "INSUFFICIENT_ALLOWANCE");

        // Verify that link params are signed by valid signing key
        require(verifySignerSignature(_linkParams), "INVALID_SIGNER_SIGNATURE");

        // Verify that receiver address is signed by ephemeral link key
        require
        (
            verifyReceiverSignature(_linkParams.linkId, _receiver, _receiverSignature),
            "INVALID_RECEIVER_SIGNATURE"
        );

        return true;
    }

    /**
    * @dev Function to claim ERC721 tokens or ERC721 and native tokens. Can only be called when contract is not paused
    * @param _linkParams Link params struct
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function claimERC721
    (
        LinkParamsERC721 _linkParams,
        address payable _receiver,
        bytes calldata _receiverSignature
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
                _receiver,
                _receiverSignature
            ),
            "INVALID_CLAIM_PARAMS"
        );

        // Mark link as claimed
        claimedTo[_linkParams.linkId] = _receiver;

        // Make sure transfer succeeds
        require
        (
            _transferFunds
            (
                _linkParams.nativeTokensAmount,
                _linkParams.nft,
                _linkParams.tokenId,
                _linkParams.feeToken,
                _linkParams.feeAmount,
                _linkParams.feeReceiver == address(0) ? tx.origin : _linkParams.feeReceiver.toPayable(), //solium-disable-line security/no-tx-origin
                _receiver
            ),
            "TRANSFER_FAILED"
        );

        // Emit claim event
        emit ClaimedERC721(_linkParams.linkId, _linkParams);

        return true;
    }

    function _transferFundsERC721
    (
        uint _nativeTokensAmount,
        address _nft,
        uint _tokenId,
        address _feeToken,
        uint _feeAmount,
        address payable _feeReceiver,
        address payable _receiver
    )
    internal returns (bool)
    {
        // Transfer fee
        if (_feeAmount > 0) {
            if (_feeToken == address(0)) {
                _feeReceiver.sendValue(_feeAmount);
            }
            else {
                IERC20(_feeToken).transferFrom(sender, _feeReceiver, _feeAmount);
            }
        }

        // Transfer native tokens
        if (_nativeTokensAmount > 0) {
            _receiver.sendValue(_nativeTokensAmount);
        }

        // Transfer NFT
        IERC721(_nft).safeTransferFrom(sender, _receiver, _tokenId);

        return true;
    }

}