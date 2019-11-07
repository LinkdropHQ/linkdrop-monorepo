pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "../interfaces/ILinkdropERC721.sol";
import "./LinkdropFactoryCommon.sol";

contract LinkdropFactoryERC721 is LinkdropFactoryCommon {

    /**
    * @dev Function to verify claim params
    * @param _linkParams Link params struct
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @param _sender Linkdrop sender address
    * @param _campaignId Campaign id
    * @return True if success
    */
    function checkClaimParams
    (
        ILinkdropERC721.LinkParamsERC721 memory _linkParams,
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

        return ILinkdropERC721(getProxyAddress(_sender, _campaignId)).checkClaimParamsERC721
        (
            _linkParams,
            _receiver,
            _receiverSignature
        );
    }

    /**
    * @dev Function to claim native tokens and/or ERC20 tokens
    * @param _linkParams Link params struct
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @param _sender Linkdrop sender address
    * @param _campaignId Campaign id
    * @return True if success
    */
    function claim
       (
        ILinkdropERC721.LinkParamsERC721 memory _linkParams,
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

        // Call claim function in the context of proxy contract
        ILinkdropERC721(getProxyAddress(_sender, _campaignId)).claimERC721
        (
            _linkParams,
            _receiver,
            _receiverSignature
        );

        return true;
    }

}