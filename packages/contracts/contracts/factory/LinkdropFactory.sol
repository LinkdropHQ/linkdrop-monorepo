pragma solidity ^0.5.6;

import "./LinkdropFactoryERC20.sol";
import "./LinkdropFactoryERC721.sol";
import "../interfaces/IProxyCounterfactualFactory.sol";

contract LinkdropFactory is LinkdropFactoryERC20, LinkdropFactoryERC721 {

    /**
    * @dev Constructor that sets bootstap initcode, factory owner, chainId and master copy
    * @param _masterCopy Linkdrop mastercopy contract address to calculate bytecode from
    * @param _chainId Chain id
    */
    constructor(address payable _masterCopy, uint _chainId) public {
        _initcode = (hex"6352c7420d6000526103ff60206004601c335afa6040516060f3");
        chainId = _chainId;
        setMasterCopy(_masterCopy);
    }

    function claimAndDeploy
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address payable _linkdropMaster,
        uint _campaignId,
        bytes memory _linkdropSignerSignature,
        address payable _receiver,
        bytes memory _receiverSignature,
        address _walletFactory,
        bytes memory _createWalletData
    )
    public
    returns (bool success)
    {
        // Make sure proxy contract is deployed
        require(isDeployed(_linkdropMaster, _campaignId), "LINKDROP_PROXY_CONTRACT_NOT_DEPLOYED");

        // Make sure only whitelisted relayer calls this function
        require(isRelayer[msg.sender], "ONLY_RELAYER");

        uint fee = fees[deployed[salt(_linkdropMaster, _campaignId)]];

        // Call claim function in the context of proxy contract
        ILinkdropERC20(deployed[salt(_linkdropMaster, _campaignId)]).claim
        (
            _weiAmount,
            _tokenAddress,
            _tokenAmount,
            _expiration,
            _linkId,
            _linkdropSignerSignature,
            _receiver,
            _receiverSignature,
            msg.sender, // Fee receiver
            fee
        );

        (success, ) = _walletFactory.call(_createWalletData);
        require(success, "DEPLOY_WALLET_FAILED");
    }

}