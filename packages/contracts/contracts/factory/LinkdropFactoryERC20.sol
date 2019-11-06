pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "../interfaces/ILinkdropERC20.sol";
// import "../interfaces/ILinkdropFactoryERC20.sol";
import "./LinkdropFactoryCommon.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LinkdropFactoryERC20 is LinkdropFactoryCommon {

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

    // /**
    // * @dev Function to verify claim params
    // * @param _nativeTokensAmount Amount of native tokens to be claimed
    // * @param _token Token address
    // * @param _tokensAmount Amount of ERC20 tokens to be claimed
    // * @param _feeToken Fee token address (0x0 for native token)
    // * @param _feeAmount Fee amount
    // * @param _feeReceiver Fee receiver address
    // * @param _expiration Unix timestamp of link expiration time
    // * @param _linkId Address corresponding to link key
    // * @param _signerSignature ECDSA signature of linkdrop signer
    // * @param _receiver Address of linkdrop receiver
    // * @param _receiverSignature ECDSA signature of linkdrop receiver
    // * @param _linkdropContract Linkdrop contract address
    // * @return True if success
    // */
    function checkClaimParams
    (
        LinkParams memory _linkParams,
        address payable _receiver,
        bytes memory _receiverSignature,
        address _sender,
        uint _campaignId
    )
    public view
    returns (bool)
    {

        // Make sure proxy contract is deployed
        require(isDeployed(getProxyAddress(_sender, _campaignId)), "LINKDROP_PROXY_CONTRACT_NOT_DEPLOYED");

        ILinkdropERC20.LinkParams memory linkParams = ILinkdropERC20.LinkParams
        (
            _linkParams.token,
            _linkParams.feeToken,
            _linkParams.feeReceiver,
            _linkParams.linkId,
            _linkParams.nativeTokensAmount,
            _linkParams.tokensAmount,
            _linkParams.feeAmount,
            _linkParams.expiration,
            _linkParams.signerSignature
        );

        return ILinkdropERC20(getProxyAddress(_sender, _campaignId)).checkClaimParams
        (
            linkParams,
            _receiver,
            _receiverSignature
        );
    }

    // /**
    // * @dev Function to claim native tokens and/or ERC20 tokens
    // * @param _nativeTokensAmount Amount of native tokens to be claimed
    // * @param _token ERC20 token address
    // * @param _tokensAmount Amount of tokens to be claimed (in atomic value)
    // * @param _feeToken Fee token (0x0 for native token)
    // * @param _feeAmount Fee amount
    // * @param _feeReceiver Fee receiver address
    // * @param _expiration Link expiration unix timestamp
    // * @param _linkId Address corresponding to link key
    // * @param _signerSignature ECDSA signature of linkdrop signer
    // * @param _receiver Address of linkdrop receiver
    // * @param _receiverSignature ECDSA signature of linkdrop receiver
    // * @param _linkdropContract Linkdrop contract address
    // * @return True if success
    // */
    function claim
       (
        LinkParams memory _linkParams,
        address payable _receiver,
        bytes memory _receiverSignature,
        address _sender,
        uint _campaignId

    )
    public
    returns (bool)
    {
        // Make sure proxy contract is deployed
        require(isDeployed(getProxyAddress(_sender, _campaignId)), "LINKDROP_PROXY_CONTRACT_NOT_DEPLOYED");

        ILinkdropERC20.LinkParams memory linkParams = ILinkdropERC20.LinkParams
        (
            _linkParams.token,
            _linkParams.feeToken,
            _linkParams.feeReceiver,
            _linkParams.linkId,
            _linkParams.nativeTokensAmount,
            _linkParams.tokensAmount,
            _linkParams.feeAmount,
            _linkParams.expiration,
            _linkParams.signerSignature
        );

        // Call claim function in the context of proxy contract
        ILinkdropERC20(getProxyAddress(_sender, _campaignId)).claim
        (
            linkParams,
            _receiver,
            _receiverSignature
        );

        return true;
    }

}