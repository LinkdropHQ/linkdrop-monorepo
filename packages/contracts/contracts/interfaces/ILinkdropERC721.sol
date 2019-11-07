pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

interface ILinkdropERC721 {

    struct LinkParamsERC721 {
        address nft;
        address feeToken;
        address payable feeReceiver;
        address linkId;
        uint nativeTokensAmount;
        uint tokenId;
        uint feeAmount;
        uint expiration;
        bytes signerSignature;
    }

    function verifySignerSignatureERC721
    (
        LinkParamsERC721 calldata _linkParams
    )
    external view returns (bool);

    function verifyReceiverSignatureERC721
    (
        address _linkId,
	    address _receiver,
		bytes calldata _receiverSignature
    )
    external pure returns (bool);

    function checkClaimParamsERC721
    (
        LinkParamsERC721 calldata _linkParams,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external view returns (bool);

    function claimERC721
    (
        LinkParamsERC721 calldata _linkParams,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external returns (bool);

    event ClaimedERC721(address indexed linkId, LinkParamsERC721 linkParams);
}
