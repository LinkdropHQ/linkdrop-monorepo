pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

contract ILinkdropERC20 {

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

    function verifySignerSignature
    (
        LinkParams memory _link
    )
    public view returns (bool);

    function verifyReceiverSignature
    (
        address _linkId,
	    address payable _receiver,
		bytes calldata _receiverSignature
    )
    external view returns (bool);

    function checkClaimParams
    (
        LinkParams memory _link,
        address payable _receiver,
        bytes memory _receiverSignature
    )
    public view returns (bool);

    function claim
    (
        LinkParams memory _link,
        address payable _receiver,
        bytes memory _receiverSignature
    )
    public returns (bool);

}