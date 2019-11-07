pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

interface ILinkdrop {

    struct LinkParams {
        address token;
        address nft;
        address feeToken;
        address payable feeReceiver;
        address linkId;
        uint nativeTokensAmount;
        uint tokensAmount;
        uint tokenId;
        uint feeAmount;
        uint expiration;
        bytes signerSignature;
    }

    function verifySignerSignature
    (
        LinkParams calldata _linkParams
    )
    external view returns (bool);

    function verifyReceiverSignature
    (
        address _linkId,
	    address _receiver,
		bytes calldata _receiverSignature
    )
    external pure returns (bool);

    function checkClaimParams
    (
        LinkParams calldata _linkParams,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external view returns (bool);

    function claim
    (
        LinkParams calldata _linkParams,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external returns (bool);

    function initialize
    (
        address _owner,
        address payable _sender,
        uint _version,
        uint _chainId
    )
    external returns (bool);

    function isClaimedLink(address _linkId) external view returns (bool);
    function isCanceledLink(address _linkId) external view returns (bool);
    function paused() external view returns (bool);
    function cancel(address _linkId) external  returns (bool);
    function withdraw() external returns (bool);
    function pause() external returns (bool);
    function unpause() external returns (bool);
    function addSigner(address _signer) external payable returns (bool);
    function removeSigner(address _signer) external returns (bool);
    function destroy() external;
    function getMasterCopyVersion() external view returns (uint);
    function () external payable;

    event Claimed(address indexed linkId, LinkParams linkParams);
    event Canceled(address indexed linkId);
    event Paused();
    event Unpaused();
    event AddedSigningKey(address signer);
    event RemovedSigningKey(address signer);

}