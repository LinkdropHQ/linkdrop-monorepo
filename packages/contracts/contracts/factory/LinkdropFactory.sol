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
        bytes calldata _claimData,
        address _walletFactory,
        address _publicKey,
        bytes calldata _initializeWithENS,
        bytes calldata _signature
    )
    external
    returns (bool success)
    {
        // Make sure only whitelisted relayer calls this function
        require(isRelayer[msg.sender], "ONLY_RELAYER");

        // solium-disable-next-line security/no-low-level-calls
        (success, ) = address(this).call(_claimData);
        require(success, "CLAIM_FAILED");

        IProxyCounterfactualFactory walletFactory = IProxyCounterfactualFactory(_walletFactory);
        require(walletFactory.createContract(_publicKey, _initializeWithENS, _signature), "WALLET_DEPLOY_FAILED");

        return success;
    }

}