pragma solidity ^0.5.6;

interface ILinkdropERC20 {

    function verifySignerSignature
    (
        uint _nativeTokensAmount,
        address _token,
        uint _tokensAmount,
        address _feeToken,
        uint _feeAmount,
        uint _expiration,
        address _linkId,
        bytes calldata _signerSignature
    )
    external view returns (bool);

    function verifyReceiverSignature
    (
        address _linkId,
	    address _receiver,
		bytes calldata _receiverSignature
    )
    external view returns (bool);

    function checkClaimParams
    (
        uint _nativeTokensAmount,
        address _token,
        uint _tokensAmount,
        address _feeToken,
        uint _feeAmount,
        address _feeReceiver,
        uint _expiration,
        address _linkId,
        bytes calldata _signerSignature,
        address _receiver,
        bytes calldata _receiverSignature
    )
    external view returns (bool);

    function claim
    (
        uint _nativeTokensAmount,
        address _token,
        uint _tokensAmount,
        address _feeToken,
        uint _feeAmount,
        address _feeReceiver,
        uint _expiration,
        address _linkId,
        bytes calldata _signerSignature,
        address _receiver,
        bytes calldata _receiverSignature
    )
    external returns (bool);

}