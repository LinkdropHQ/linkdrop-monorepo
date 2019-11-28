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
  senderAddress,
  factoryAddress,
  сhain = 'mainnet',
  jsonRpcUrl = `https://${chain}.infura.io`,
  apiHost = `https://${chain}.linkdrop.io`,
  claimHost = 'https://claim.linkdrop.io'
})
```

Linkdrop SDK constructor takes following params:

- Required params:
  - senderAddress - Linkdrop sender address
  - factoryAddress - Linkdrop factory contract address

You can use the factory contract deployed on Mainnet, Ropsten, Rinkeby, Goerli and Kovan at 0xBa051891B752ecE3670671812486fe8dd34CC1c8

- Optional params:
  - chain - Chain name, Currently supported chains are 'mainnet', 'ropsten', 'rinkeby', 'goerli' and 'kovan'. Will use 'mainnet' by default
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
    tokensAmount
})
```
This function will approve `tokensAmount` tokens to provided proxy address

### Approve all non fungible ERC721 tokens to proxy contract

```js
const txHash = await linkdropSDK.approveNFT({ 
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
    nativeTokensAmount 
})
```
This function will topup the provided proxy address with `nativeTokensAmount` of native tokens amount


### Top-up and deploy proxy contract

```js
const txHash = await linkdropSDK.deployProxy({ signingKeyOrWallet, campaignId = 0, nativeTokensAmount = 0 })
```

This function will deploy a proxy contract for a given campaign id and top it up with `nativeTokensAmount` provided

## Generate links

### Generate link

```js
const {
  url,
  linkId,
  linkKey,
  linkParams,
  signerSignature
} = await linkdropSDK.generateLink({
    campaignId = 0, // Campaign id
    token = AddressZero, // ERC20 token address
    nft = AddressZero, // ERC721 token address
    feeToken = AddressZero, // Fee token address (0x0 for native token)
    feeReceiver = AddressZero, // Fee receiver address
    nativeTokensAmount = 0, // Native tokens amount
    tokensAmount = 0, // ERC20 tokens amount
    tokenId = 0, // ERC721 token id
    feeAmount = 0, // Fee amount
    expiration = 11111111111, // Link expiration timestamp
    signingKeyOrWallet // Signer's private key
  })
```

This function will generate link to claim native tokens and/or ERC20 tokens and/or ERC721 token and return the following params `url, linkId, linkKey, linkParams, signerSignature`

## Claim links

```js
const txHash = await linkdropSDK.claim({
    token, // ERC20 token address
    nft, // ERC721 token address
    feeToken, // Fee token (0x0 for native token)
    feeReceiver, // Fee receiver address
    linkKey, // Ephemeral link key
    nativeTokensAmount, // Native tokens amount
    tokensAmount, // ERC20 tokens amount
    tokenId, // ERC71 token id
    feeAmount, // Fee amount
    expiration, // Link expiration timestamp
    signerSignature, // Signer signature
    receiverAddress, // Receiver address
    linkdropContract // Linkdrop contract address
  }
```

This function will claim ETH and/or ERC20 tokens and/or ERC721 token by making a POST request to the server endpoint. Make sure the server is up by running `yarn server`.

### Subscribe for `Claimed` events

```js
await linkdropSDK.subscribeForClaimEvents(proxyAddress, callback)
```

## Stay in Touch
- 💬 Join [Linkdrop Community](https://t.me/linkdrophq) in Telegram to chat with the core team
- 🕹 Try out [Linkdrop Dashboard](https://dashboard.linkdrop.io) to generate onboarding links
- 🙌 Want to contribute to the project — just ping us
- 💌 Reach us at hi@linkdop.io
