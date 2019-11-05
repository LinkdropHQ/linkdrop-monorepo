pragma solidity ^0.5.6;

import "../storage/LinkdropFactoryStorage.sol";
import "../interfaces/ILinkdropCommon.sol";
import "@openzeppelin/cryptography/ECDSA.sol";
import "@openzeppelin/math/SafeMath.sol";
import "@openzeppelin/utils/ReentrancyGuard.sol";
import "@openzeppelin/utils/Address.sol";

contract LinkdropFactoryCommon is LinkdropFactoryStorage, ReentrancyGuard {

    using SafeMath for uint;
    using Address for address;
    using Address for address payable;

    /**
    * @dev Indicates whether a campaign proxy contract for sender is deployed or not
    * @param _sender Sender address
    * @param _campaignId Campaign id
    * @return True if deployed
    */
    function isDeployed(address _sender, uint _campaignId) public view returns (bool) {
        return _isDeployed(getProxyAddress(_sender, _campaignId));
    }

    function getProxyAddress(address _sender, uint _campaignId) public view returns (address proxy) {
        bytes32 temp = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt(_sender, _campaignId), getInitcode()));
        uint mask = 2 ** 160 - 1;
        //solium-disable-next-line security/no-inline-assembly
        assembly {
            proxy := and(temp, mask)
        }
    }

    /**
    * @dev Indicates whether a link is claimed or not
    * @param _sender Sender address
    * @param _campaignId Campaign id
    * @param _linkId Address corresponding to link key
    * @return True if claimed
    */
    function isClaimedLink(address _sender, uint _campaignId, address _linkId) public view returns (bool) {

        if (!isDeployed(_sender, _campaignId)) {
            return false;
        }
        else {
            address proxy = getProxyAddress(_sender, _campaignId);
            return ILinkdropCommon(proxy).isClaimedLink(_linkId);
        }

    }

    /**
    * @dev Function to deploy a proxy contract for msg.sender
    * @param _campaignId Campaign id
    * @return Proxy contract address
    */
    function deployProxy(uint _campaignId)
    public
    payable
    nonReentrant
    returns (address proxy)
    {
        proxy = _deployProxy(msg.sender, _campaignId);
    }

    /**
    * @dev Function to deploy a proxy contract for msg.sender and add a new signing key
    * @param _campaignId Campaign id
    * @param _signer Address corresponding to signing key
    * @return Proxy contract address
    */
    function deployProxyWithSigner(uint _campaignId, address _signer)
    public
    payable
    nonReentrant
    returns (address proxy)
    {
        proxy = _deployProxy(msg.sender, _campaignId);
        ILinkdropCommon(proxy).addSigner(_signer);
    }

    /**
    * @dev Internal function to deploy a proxy contract for sender
    * @param _sender Sender address
    * @param _campaignId Campaign id
    * @return Proxy contract address
    */
    function _deployProxy(address _sender, uint _campaignId)
    internal
    returns (address proxy)
    {

        require(!isDeployed(_sender, _campaignId), "LINKDROP_PROXY_CONTRACT_ALREADY_DEPLOYED");
        require(_sender != address(0), "INVALID_SENDER_ADDRESS");

        bytes32 salt = salt(_sender, _campaignId);
        bytes memory initcode = getInitcode();

        //solium-disable-next-line security/no-inline-assembly
        assembly {
            proxy := create2(0, add(initcode, 0x20), mload(initcode), salt)
            if iszero(extcodesize(proxy)) { revert(0, 0) }
        }

        _isDeployed[proxy] = true;

        // Initialize owner address, sender address master copy version in proxy contract
        require
        (
            ILinkdropCommon(proxy).initialize
            (
                address(this), // Owner address
                _sender,
                masterCopyVersion,
                chainId
            ),
            "INITIALIZATION_FAILED"
        );

        // Send funds attached to proxy contract
        proxy.toPayable().sendValue(msg.value);

        emit Deployed(_sender, _campaignId, proxy, salt);
        return proxy;
    }

    /**
    * @dev Function to destroy proxy contract, called by proxy owner
    * @param _campaignId Campaign id
    * @return True if destroyed successfully
    */
    function destroyProxy(uint _campaignId)
    public
    returns (bool)
    {
        require(isDeployed(msg.sender, _campaignId), "LINKDROP_PROXY_CONTRACT_NOT_DEPLOYED");
        address proxy = getProxyAddress(_sender, _campaignId);
        ILinkdropCommon(proxy).destroy();
        delete _isDeployed[proxy];
        emit Destroyed(msg.sender, proxy);
        return true;
    }

    /**
    * @dev Function to get bootstrap initcode for generating repeatable contract addresses
    * @return Static bootstrap initcode
    */
    function getInitcode()
    public view
    returns (bytes memory)
    {
        return _initcode;
    }

    /**
    * @dev Function to fetch the actual contract bytecode to install. Called by proxy when executing initcode
    * @return Contract bytecode to install
    */
    function getBytecode()
    public view
    returns (bytes memory)
    {
        return _bytecode;
    }

    /**
    * @dev Function to set new master copy and update contract bytecode to install. Can only be called by factory owner
    * @param _masterCopy Address of linkdrop mastercopy contract to calculate bytecode from
    * @return True if updated successfully
    */
    function setMasterCopy(address payable _masterCopy)
    public onlyOwner
    returns (bool)
    {
        require(_masterCopy != address(0), "INVALID_MASTER_COPY_ADDRESS");
        masterCopyVersion = masterCopyVersion.add(1);

        require
        (
            ILinkdropCommon(_masterCopy).initialize
            (
                address(0), // Owner address
                address(0), // Linkdrop master address
                masterCopyVersion,
                chainId
            ),
            "INITIALIZATION_FAILED"
        );

        bytes memory bytecode = abi.encodePacked
        (
            hex"363d3d373d3d3d363d73",
            _masterCopy,
            hex"5af43d82803e903d91602b57fd5bf3"
        );

        _bytecode = bytecode;

        emit SetMasterCopy(_masterCopy, masterCopyVersion);
        return true;
    }

    /**
    * @dev Function to fetch the master copy version installed (or to be installed) to proxy
    * @param _sender Sender address
    * @param _campaignId Campaign id
    * @return Master copy version
    */
    function getProxyMasterCopyVersion(address _sender, uint _campaignId) external view returns (uint) {

        if (!isDeployed(_sender, _campaignId)) {
            return masterCopyVersion;
        }
        else {
            address proxy = getProxyAddress(_sender, _campaignId);
            return ILinkdropCommon(proxy).getMasterCopyVersion();
        }
    }

    /**
     * @dev Function to hash `_sender` and `_campaignId` params. Used as salt when deploying with create2
     * @param _sender Sender address
     * @param _campaignId Campaign id
     * @return Hash of passed arguments
     */
    function salt(address _sender, uint _campaignId) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_sender, _campaignId));
    }

}