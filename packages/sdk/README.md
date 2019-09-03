# Linkdrop SDK

It's either possible to generate links and campaigns using our [Dashboard](https://dashboard.linkdrop.io) or using SDK:

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

## Initialization

```js
const linkdropSDK = new LinkdropSDK({
  linkdropMasterAddress,
  factoryAddress,
  сhain = 'mainnet',
  jsonRpcUrl = `https://${chain}.infura.io`,
  apiHost = `https://${chain}.linkdrop.io`,
  claimHost = 'https://claim.linkdrop.io'
})
```

Linkdrop SDK constructor takes following params:

- Required params:
  - linkdropMasterAddress - Linkdrop master address
  - factoryAddress - Linkdrop factory contract address

You can use the factory contract deployed on Mainnet, Rinkeby and Goerli at 0xBa051891B752ecE3670671812486fe8dd34CC1c8

- Optional params:
  - chain - Chain name, Currently supported chains are 'mainnet', 'rinkeby' and 'goerli'. Will use 'mainnet' by default
  - jsonRpcUrl - JSON RPC URL to Ethereum node. Will use `${chain}.infura.io` by default
  - apiHost - Linkdrop Relayer Service API host. Will use `${chain}.linkdrop.io` by default
  - claimHost - Claiming page url host. Will use `claim.linkdrop.io` by default

With the SDK initialized you now need to take the following steps to distribute claimable linkdrops:

### Precompute proxy address

```js
let proxyAddress = linkdropSDK.getProxyAddress(campaignId = 0)
```

This function precomputes the proxy address for each campaign. 

⚠️ If you are integrating one-to-one linkdrops you should always use `campaignId = 0`


### Approve ERC20 tokens to proxy address

```js
const txHash = await linkdropSDK.approve({ 
    signingKeyOrWallet,
    proxyAddress,
    tokenAddress,
    tokenAmount
})
```
This function will approve `tokenAmount` tokens to provided proxy address

### Approve ERC721 tokens to proxy contract

```js
const txHash = await linkdropSDK.approveERC721({ 
    signingKeyOrWallet,
    proxyAddress,
    nftAddress
})
```
This function will approve all NFTs to provided proxy address

### Top-up proxy address with ETH

```js
const txHash = await linkdropSDK.topup({ 
    signingKeyOrWallet,
    proxyAddress,
    weiAmount 
})
```
This function will topup the provided proxy address with `weiAmount` ethers


### Top-up and deploy proxy contract

```js
const txHash = await linkdropSDK.deployProxy({ signingKeyOrWallet, campaignId = 0, weiAmount })
```

This function will deploy a proxy contract for a given campaign id and top it up with `weiAmount` provided

## Generate links

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

## Claim links

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

## Stay in Touch
💬 Join Linkdrop Community Telegram to chat with the core team
📈 Try out Linkdrop Dashboard to generate onboarding links
🙌 Want to contribute to the project—just ping us
💌 Reach us at hi@linkdop.io
