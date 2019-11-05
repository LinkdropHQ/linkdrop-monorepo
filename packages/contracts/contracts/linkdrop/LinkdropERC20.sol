pragma solidity ^0.5.6;

import "openzeppelin-solidity/token/ERC20/IERC20.sol";
import "../interfaces/ILinkdropERC20.sol";
import "./LinkdropCommon.sol";
import "openzeppelin-solidity/utils/ReentrancyGuard.sol";
import "openzeppelin-solidity/utils/Address.sol";


contract LinkdropERC20 is ILinkdropERC20, LinkdropCommon {

    using SafeMath for uint;
    using Address for address payable;

    /**
    * @dev Function to verify linkdrop signer's signature
    * @param _nativeTokensAmount Amount of native tokens to be claimed
    * @param _token ERC20 token address
    * @param _tokensAmount Amount of tokens to be claimed
    * @param _feeToken Fee token address (0x0 for native token)
    * @param _feeAmount Fee amount
    * @param _feeReceiver Fee receiver address
    * @param _expiration Link expiration unix timestamp
    * @param _linkId Address corresponding to link key
    * @param _signerSignature ECDSA signature of linkdrop signer
    * @return True if signed with valid signer's private key
    */
    function verifySignerSignature
    (
        uint _nativeTokensAmount,
        address _token,
        uint _tokensAmount,
        address _feeToken,
        uint _feeAmount,
        address payable _feeReceiver,
        uint _expiration,
        address _linkId,
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
                    _nativeTokensAmount,
                    _token,
                    _tokensAmount,
                    _feeToken,
                    _feeAmount,
                    _feeReceiver,
                    _expiration,
                    _linkId,
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
    public view
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_receiver)));
        address signer = ECDSA.recover(prefixedHash, _receiverSignature);
        return signer == _linkId;
    }

    /**
    * @dev Function to verify claim params
    * @param _nativeTokensAmount Amount of native tokens to be claimed
    * @param _token ERC20 token address
    * @param _tokensAmount Amount of tokens to be claimed
    * @param _feeToken Fee token address (0x0 for native token)
    * @param _feeAmount Fee amount
    * @param _feeReceiver Fee receiver address
    * @param _expiration Link expiration unix timestamp
    * @param _linkId Address corresponding to link key
    * @param _signerSignature ECDSA signature of linkdrop signer
    * @param _receiver Linkdrop receiver address
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function checkClaimParams
    (
        uint _nativeTokensAmount,
        address _token,
        uint _tokensAmount,
        address _feeToken,
        uint _feeAmount,
        address payable _feeReceiver,
        uint _expiration,
        address _linkId,
        bytes memory _signerSignature,
        address _receiver,
        bytes memory _receiverSignature
    )
    public view
    whenNotPaused
    returns (bool)
    {
        // If tokens are being claimed
        if (_tokensAmount > 0) {
            require(_token != address(0), "INVALID_TOKEN_ADDRESS");
        }

        // Make sure link is not claimed
        require(!isClaimedLink(_linkId), "LINK_CLAIMED");

        // Make sure link is not canceled
        require(!isCanceledLink(_linkId), "LINK_CANCELED");

        // Make sure link is not expired
        require(_expiration >= now, "LINK_EXPIRED"); //solium-disable-line security/no-block-members

        // If fee is being paid in native tokens
        if (_feeToken == address(0)) {
            // Make sure native tokens amount is enough to cover both linkdrop and fee costs
            require(address(this).balance >= _nativeTokensAmount.add(_feeAmount), "INSUFFICIENT_NATIVE_TOKENS");
        }
        // If fee is being paid in ERC20 tokens
        else {
            require(address(this).balance >= _nativeTokensAmount, "INSUFFICIENT_NATIVE_TOKENS");
            require(IERC20(_feeToken).balanceOf(sender) >= _feeAmount,"INSUFFICIENT_FEE_TOKENS");
            require(IERC20(_feeToken).allowance(sender, address(this)) >= _feeAmount, "INSUFFICIENT_FEE_TOKENS_ALLOWANCE");
        }

        // Make sure tokens are available for this contract
        if (_token != address(0)) {
            require
            (
                IERC20(_token).balanceOf(sender) >= _tokensAmount,
                "INSUFFICIENT_TOKENS"
            );

            require
            (
                IERC20(_token).allowance(sender, address(this)) >= _tokensAmount, "INSUFFICIENT_TOKENS_ALLOWANCE"
            );
        }

        // Verify that link key is legit and signed by valid signing key
        require
        (
            verifySignerSignature
            (
                _nativeTokensAmount,
                _token,
                _tokensAmount,
                _feeToken,
                _feeAmount,
                _feeReceiver,
                _expiration,
                _linkId,
                _signerSignature
            ),
            "INVALID_SIGNER_SIGNATURE"
        );

        // Verify that receiver address is signed by ephemeral link key
        require
        (
            verifyReceiverSignature(_linkId, _receiver, _receiverSignature),
            "INVALID_RECEIVER_SIGNATURE"
        );

        return true;
    }

    /**
    * @dev Function to claim native tokens and/or ERC20 tokens. Can only be called when contract is not paused
    * @param _nativeTokensAmount Amount of native tokens to be claimed
    * @param _token ERC20 token address
    * @param _tokenAmount Amount of tokens to be claimed
    * @param _feeToken Fee token address (0x0 for native token)
    * @param _feeAmount Fee amount
    * @param _feeReceiver Fee receiver address
    * @param _expiration Link expiration unix timestamp
    * @param _linkId Address corresponding to link key
    * @param _signerSignature ECDSA signature of linkdrop signer
    * @param _receiver Linkdrop receiver address
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function claim
    (
        uint _nativeTokensAmount,
        address _token,
        uint _tokensAmount,
        address _feeToken,
        uint _feeAmount,
        address payable _feeReceiver,
        uint _expiration,
        address _linkId,
        bytes memory _signerSignature,
        address _receiver,
        bytes memory _receiverSignature
    )
    external
    whenNotPaused
    nonReentrant
    returns (bool)
    {

        // Make sure params are valid
        require
        (
            checkClaimParams
            (
                _nativeTokensAmount,
                _token,
                _tokensAmount,
                _feeToken,
                _feeAmount,
                _feeReceiver,
                _expiration,
                _linkId,
                _signerSignature,
                _receiver,
                _receiverSignature
            ),
            "INVALID_CLAIM_PARAMS"
        );

        // Mark link as claimed
        claimedTo[_linkId] = _receiver;

        // Make sure transfer succeeds
        require
        (
            _transferFunds
            (
                _nativeTokensAmount,
                _token,
                _tokensAmount,
                _feeToken,
                _feeAmount,
                _feeReceiver == address(0) ? tx.origin : _feeReceiver, //solium-disable-line security/no-tx-origin
                _receiver
            ),
            "TRANSFER_FAILED"
        );

        // Emit claim event
        emit Claimed(_linkId, _nativeTokensAmount, _token, _tokensAmount, _feeToken, _feeAmount, _feeReceiver, _receiver);

        return true;
    }

    /**
    * @dev Internal function to handle linkdrop and fee transfer
    * @param _nativeTokensAmount Amount of native tokens to be claimed
    * @param _token Token address
    * @param _tokenAmount Amount of ERC20 tokens to be claimed
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
        uint _tokenAmount,
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
                _feeReceiver.sendValue(_fee);
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