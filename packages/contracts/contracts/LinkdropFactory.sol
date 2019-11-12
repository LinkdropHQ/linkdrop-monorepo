pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./interfaces/ILinkdrop.sol";

/**
* @title Linkdrop factory contract
* @author Amir Jumaniyazov - <amir@linkdrop.io>
*/
contract LinkdropFactory is Ownable, ReentrancyGuard {

    using SafeMath for uint;
    using Address for address;
    using Address for address payable;

    // Current version of mastercopy contract
    uint public masterCopyVersion;

    // Contract bytecode to be installed when deploying proxy
    bytes internal _bytecode;

    // Bootstrap initcode to fetch the actual contract bytecode. Used to generate repeatable contract addresses
    bytes internal _initcode;

    // Network id
    uint public chainId;

    // Is proxy contract deployed
    mapping (address => bool) internal _isDeployed;

    // Events
    event Deployed(address indexed sender, uint campaignId, address indexed proxy, bytes32 salt);
    event Destroyed(address indexed sender, address indexed proxy);
    event SetMasterCopy(address masterCopy, uint indexed version);

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
        ILinkdrop.LinkParams memory _linkParams,
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

        return ILinkdrop(getProxyAddress(_sender, _campaignId)).checkClaimParams
        (
            _linkParams,
            _receiver,
            _receiverSignature
        );
    }

    /**
    * @dev Function to claim linkdrop
    * @param _linkParams Link params struct
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @param _sender Linkdrop sender address
    * @param _campaignId Campaign id
    * @return True if success
    */
    function claim
       (
        ILinkdrop.LinkParams memory _linkParams,
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
        ILinkdrop(getProxyAddress(_sender, _campaignId)).claim
        (
            _linkParams,
            _receiver,
            _receiverSignature
        );

        return true;
    }


    /**
    * @dev Indicates whether a campaign proxy contract for sender is deployed or not
    * @param _sender Sender address
    * @param _campaignId Campaign id
    * @return True if deployed
    */
    function isDeployed(address _sender, uint _campaignId)
    public view
    returns (bool)
    {
        return _isDeployed[getProxyAddress(_sender, _campaignId)];
    }

    /**
    * @dev Indicates whether a linkdrop contract deployed or not
    * @param _linkdropContract Linkdrop contract address
    * @return True if deployed
    */
    function isDeployed(address _linkdropContract)
    public view
    returns (bool)
    {
        return _isDeployed[_linkdropContract];
    }

    /**
    * @dev Function to precompute campaign proxy address for sender
    * @param _sender Linkdrop sender address
    * @param _campaignId Campaign id
    * @return Proxy address
    */
    function getProxyAddress(address _sender, uint _campaignId)
    public view
    returns (address payable proxy)
    {
        bytes32 temp = keccak256(abi.encodePacked
        (
            bytes1(0xff),
            address(this),
            salt(_sender, _campaignId),
            keccak256(getInitcode())
        ));
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
    function isClaimedLink(address _sender, uint _campaignId, address _linkId)
    public view
    returns (bool)
    {
        if (!isDeployed(getProxyAddress(_sender, _campaignId))) {
            return false;
        }
        else {
            return ILinkdrop(getProxyAddress(_sender, _campaignId)).isClaimedLink(_linkId);
        }
    }

    /**
    * @dev Function to deploy a proxy contract for msg.sender
    * @param _campaignId Campaign id
    * @return Proxy contract address
    */
    function deployProxy(uint _campaignId)
    public payable nonReentrant
    returns (address payable proxy)
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
    public payable nonReentrant
    returns (address payable proxy)
    {
        proxy = _deployProxy(msg.sender, _campaignId);
        ILinkdrop(proxy).addSigner(_signer);
    }

    /**
    * @dev Internal function to deploy a proxy contract for sender
    * @param _sender Sender address
    * @param _campaignId Campaign id
    * @return Proxy contract address
    */
    function _deployProxy(address payable _sender, uint _campaignId)
    internal
    returns (address payable proxy)
    {
        require(!isDeployed(getProxyAddress(_sender, _campaignId)), "LINKDROP_PROXY_CONTRACT_ALREADY_DEPLOYED");
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
            ILinkdrop(proxy).initialize
            (
                address(this), // Owner address
                _sender,
                masterCopyVersion,
                chainId
            ),
            "INITIALIZATION_FAILED"
        );

        // Send funds attached to proxy contract
        proxy.sendValue(msg.value);

        emit Deployed(_sender, _campaignId, proxy, salt);
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
        address payable proxy = getProxyAddress(msg.sender, _campaignId);
        require(isDeployed(proxy), "LINKDROP_PROXY_CONTRACT_NOT_DEPLOYED");
        ILinkdrop(proxy).destroy();
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
            ILinkdrop(_masterCopy).initialize
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
    function getProxyMasterCopyVersion(address _sender, uint _campaignId)
    external view
    returns (uint)
    {

        address payable proxy = getProxyAddress(_sender, _campaignId);

        if (!isDeployed(proxy)) {
            return masterCopyVersion;
        }
        else {
            return ILinkdrop(proxy).getMasterCopyVersion();
        }
    }

    /**
     * @dev Function to hash `_sender` and `_campaignId` params. Used as salt for create2
     * @param _sender Sender address
     * @param _campaignId Campaign id
     * @return Hash of passed arguments
     */
    function salt(address _sender, uint _campaignId)
    public pure
    returns (bytes32)
    {
        return keccak256(abi.encodePacked(_sender, _campaignId));
    }

}