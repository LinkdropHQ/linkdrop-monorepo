pragma solidity ^0.5.6;

contract IProxyCounterfactualFactory {

    function createContract
    (
        address publicKey,
        bytes memory initializeWithENS,
        bytes memory signature
    )
    public
    returns (bool);

}
