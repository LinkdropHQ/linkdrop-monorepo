pragma solidity ^0.5.6;

import "../interfaces/ILinkdropERC20.sol";
import "../interfaces/ILinkdropFactoryERC20.sol";
import "./LinkdropFactoryCommon.sol";
import "openzeppelin-solidity/token/ERC20/IERC20.sol";

contract LinkdropFactoryERC20 is ILinkdropFactoryERC20, LinkdropFactoryCommon {

    /**
    * @dev Function to verify claim params
    * @param _nativeTokensAmount Amount of native tokens to be claimed
    * @param _token Token address
    * @param _tokensAmount Amount of ERC20 tokens to be claimed
    * @param _feeToken Fee token address (0x0 for native token)
    * @param _feeAmount Fee amount
    * @param _feeReceiver Fee receiver address
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _signerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @param _linkdropContract Linkdrop contract address
    * @return True if success
    */
    function checkClaimParams
    (
        uint _nativeTokensAmount,
        address _token,
        uint _tokenAmount,
        address _feeToken,
        uint _feeAmount,
        address payable _feeReceiver,
        uint _expiration,
        address _linkId,
        bytes memory _signerSignature,
        address payable _receiver,
        bytes memory _receiverSignature,
        address _linkdropContract
    )
    public view
    returns (bool)
    {
        // Make sure proxy contract is deployed
        require(isDeployed(_linkdropContract), "LINKDROP_PROXY_CONTRACT_NOT_DEPLOYED");

        return ILinkdropERC20(_linkdropContract).checkClaimParams
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
        );
    }

    /**
    * @dev Function to claim native tokens and/or ERC20 tokens
    * @param _nativeTokensAmount Amount of native tokens to be claimed
    * @param _token ERC20 token address
    * @param _tokensAmount Amount of tokens to be claimed (in atomic value)
    * @param _feeToken Fee token (0x0 for native token)
    * @param _feeAmount Fee amount
    * @param _feeReceiver Fee receiver address
    * @param _expiration Link expiration unix timestamp
    * @param _linkId Address corresponding to link key
    * @param _signerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @param _linkdropContract Linkdrop contract address
    * @return True if success
    */
    function claim
       (
        uint _nativeTokensAmount,
        address _token,
        uint _tokenAmount,
        address _feeToken,
        uint _feeAmount,
        address payable _feeReceiver,
        uint _expiration,
        address _linkId,
        bytes memory _signerSignature,
        address payable _receiver,
        bytes memory _receiverSignature,
        address _linkdropContract
    )
    external
    returns (bool)
    {
        // Make sure proxy contract is deployed
        require(isDeployed(_linkdropContract), "LINKDROP_PROXY_CONTRACT_NOT_DEPLOYED");

        // Call claim function in the context of proxy contract
        ILinkdropERC20(_linkdropContract).claim
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
        );

        return true;
    }

}