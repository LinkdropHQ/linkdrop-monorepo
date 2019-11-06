pragma solidity ^0.5.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./LinkdropCommon.sol";

contract LinkdropERC20 is LinkdropCommon {

    using SafeMath for uint;
    // using Address for address payable;
    // using Address for address;


    /**
    * @dev Function to verify linkdrop signer's signature
    * @param _linkParams Link params struct
    * @return True if signed with valid signer's private key
    */
    function verifySignerSignature
    (
        LinkParams memory _linkParams
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
                    _linkParams.token,
                    _linkParams.feeToken,
                    _linkParams.feeReceiver,
                    _linkParams.linkId,
                    _linkParams.nativeTokensAmount,
                    _linkParams.tokensAmount,
                    _linkParams.feeAmount,
                    _linkParams.expiration,
                    version,
                    chainId,
                    address(this)
                )
            )
        );
        address signer = ECDSA.recover(prefixedHash, _linkParams.signerSignature);
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
        address payable _receiver,
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
    * @param _receiver Linkdrop receiver address
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function checkClaimParams
    (
        LinkParams memory _linkParams,
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

        // Make sure tokens are available for this contract
        if (_linkParams.token != address(0)) {
            require
            (
                IERC20(_linkParams.token).balanceOf(sender) >= _linkParams.tokensAmount,
                "INSUFFICIENT_TOKENS"
            );

            require
            (
                IERC20(_linkParams.token).allowance(sender, address(this)) >= _linkParams.tokensAmount, "INSUFFICIENT_TOKENS_ALLOWANCE"
            );
        }

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
    * @dev Function to claim native tokens and/or ERC20 tokens. Can only be called when contract is not paused
    * @param _linkParams Link params struct
    * @param _receiver Linkdrop receiver address
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function claim
    (
        LinkParams memory _linkParams,
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
                _linkParams.token,
                _linkParams.tokensAmount,
                _linkParams.feeToken,
                _linkParams.feeAmount,
                _linkParams.feeReceiver == address(0) ? tx.origin : _linkParams.feeReceiver.toPayable(), //solium-disable-line security/no-tx-origin
                _receiver
            ),
            "TRANSFER_FAILED"
        );

        // Emit claim event
        emit Claimed(_linkParams.linkId, _linkParams);

        return true;
    }

    /**
    * @dev Internal function to handle linkdrop and fee transfer
    * @param _nativeTokensAmount Amount of native tokens to be claimed
    * @param _token Token address
    * @param _tokensAmount Amount of ERC20 tokens to be claimed
    * @param _feeToken Fee token address (0x0 for native token)
    * @param _feeAmount Fee amount
    * @param _feeReceiver Fee receiver address
    * @param _receiver Address to transfer funds to
    * @return True if success
    */
    function _transferFunds
    (
        uint _nativeTokensAmount,
        address _token,
        uint _tokensAmount,
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

        // Transfer tokens
        if (_tokensAmount > 0) {
            IERC20(_token).transferFrom(sender, _receiver, _tokensAmount);
        }

        return true;
    }

}