pragma solidity ^0.5.12;
import "@openzeppelin/contracts/token/ERC721/ERC721Metadata.sol";

contract NFTMock is ERC721Metadata {

    // =================================================================================================================
    //                                         NFT Mock
    // =================================================================================================================

    // Mint 10 initial NFTs to deployer
    constructor() public ERC721Metadata ("Mock NFT", "MOCK") {
        for (uint i = 0; i < 10; i++) {
            super._mint(msg.sender, i);
            super._setTokenURI(i, "https://api.myjson.com/bins/1dhwd6");
        }
    }

    function mint(address to, uint256 tokenId) public returns (bool) {
        _mint(to, tokenId);
        return true;
    }

}