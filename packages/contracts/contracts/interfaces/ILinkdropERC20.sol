pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

interface ILinkdropERC20 {

    struct LinkParams {
        address token;
        address feeToken;
        address payable feeReceiver;
        address linkId;
        uint nativeTokensAmount;
        uint tokensAmount;
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

    event Claimed(address indexed linkId, LinkParams linkParams);
}