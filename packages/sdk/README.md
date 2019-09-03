# Linkdrop SDK

## Short description

SDK for computing proxy address, generating and claiming linkdrops

## Installation

```bash
yarn add @linkdrop/sdk
```

## Usage

```js
const LinkdropSDK = require('@linkdrop/sdk')

// OR

import LinkdropSDK from '@linkdrop/sdk'
```

### Initialization

```js
const linkdropSDK = LinkdropSDK({
  linkdropMasterAddress: <LINKDROP_MASTER_ADDRESS>,
  // optional params:
  // chain = <CHAIN>, // 'mainnet' by default
  // chainId = <CHAIN_ID>, // getChainId(chain) by default
  // jsonRpcUrl = <JSON_RPC_URL>, // `https://${chain}.infura.io` by default,
  // apiHost = <API_HOST>, // `https://${chain}.linkdrop.io` by default
  // claimHost = <CLAIM_HOST>, // 'https://claim.linkdrop.io' by default
  // factory = <LINKDROP_FACTORY_ADDRESS>, // '0x01e7F4C72182Eb4421AFB1Ec99cee9Ef5B83EE18' by default
}))
```

### Get proxy address

```js
const campaignId = 1
const proxyAddress = linkdropSDK.getProxyAddress(campaignId)
```

### Generate link for ETH or ERC20

```js
const {
  url,
  linkId,
  linkKey,
  linkdropSignerSignature
} = await linkdropSDK.generateLink({
    signingKeyOrWallet, // Signing private key or ethers.js Wallet instance
    weiAmount, // Amount of wei per claim
    tokenAddress, // ERC20 token address
    tokenAmount, // Amount of ERC20 tokens per claim
    expirationTime = 12345678910, // Link expiration time
    campaignId = 0, // Campaign id
  })
```

This function will generate link for claiming ETH or any ERC20 token and return the following params `url, linkId, linkKey, linkdropSignerSignature`

### Generate link for ERC721

```js
const {
  url,
  linkId,
  linkKey,
  linkdropSignerSignature
} = await linkdropSDK.generateLinkERC721({
    signingKeyOrWallet, // Signing private key or ethers.js Wallet instance
    weiAmount, // Amount of wei per claim
    nftAddress, // ERC721 token address
    tokenId, // Token id
    expirationTime = 12345678910, // Link expiration time
    campaignId = 0, // Campaign id
  })
```

This function will generate link for claiming ERC721 token and return the following params `url, linkId, linkKey, linkdropSignerSignature`

### Claim ETH or ERC20

```js
const txHash = await linkdropSDK.claim({
    weiAmount, // Amount of wei per claim
    tokenAddress, // ERC20 token address
    tokenAmount, // Amount of ERC20 tokens to claim
    expirationTime = 12345678910, // Link expiration time
    linkKey, // Link ephemeral key
    linkdropSignerSignature, // Signature of linkdrop signer
    receiverAddress, // Address of receiver
    campaignId = 0, // Campaign id
}
```

This function will claim ETH or ERC20 token by making a POST request to server endpoint. Make sure the server is up by running `yarn server`.

### Claim ERC721

```js
const txHash = await linkdropSDK.claim({
    weiAmount, // Amount of wei per claim
    nftAddress, // ERC721 token address
    tokenId, // Token id to claim
    expirationTime = 12345678910, // Link expiration time
    linkKey, // Link ephemeral key
    linkdropSignerSignature, // Signature of linkdrop signer
    receiverAddress, // Address of receiver
    campaignId = 0, // Campaign id
}
```

This function will claim ETH or ERC20 token by making a POST request to server endpoint. Make sure the server is up by running `yarn server`.
