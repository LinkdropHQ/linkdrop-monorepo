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

    //only Owner of wallet factory
    //and only whitelisted linkdrop relayer
    function claimAndDeploy
    (
        uint _weiAmount,
        address _tokenAddress,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        address payable _linkdropMaster,
        uint _campaignId,
        bytes calldata _linkdropSignerSignature,
        address payable _receiver, // wallet contract address
        bytes calldata _receiverSignature,
        address _walletFactory,
        address _publicKey,
        bytes memory _initializeWithENS,
        bytes memory _signature
    )
    external
    returns (bool)
    {
        require
        (
            claim
            (
                _weiAmount,
                _tokenAddress,
                _tokenAmount,
                _expiration,
                _linkId,
                _linkdropSignerSignature,
                _receiver,
                _receiverSignature
            ),
            "CLAIM_FAILED"
        );

        IProxyCounterfactualFactory walletFactory = IProxyCounterfactualFactory(_proxyCounterfactualFactory);
        require(walletFactory.createContract(_publicKey, _initializeWithENS, _signature), "WALLET_DEPLOY_FAILED");

    }

}