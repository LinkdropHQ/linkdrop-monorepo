# Wallet widget for IDEO x CoinList Hackathon  
## Web-wallet widget as the next step in solving the Web3 onboarding problem
This branch of the Linkdrop-monorepo contains the code for a white-label web-wallet widget we're building for the [IDEO + CoinList hackathon](https://coinlist.co/build/ideo).  
 
Starting with the launch of [eth2.io](https://eth2.io/) our team has a long history of working on the problem of introducing and onboarding new people to digital assets. Specifically we've focused on getting users outside the regular crypto nieche to try out new dapps via clicking a "Linkdrop" - a claimable digital assets encoded into a shareable link / QR code.

When we recently [launched the Linkdrop Dashboard](https://medium.com/linkdrophq/https-medium-com-linkdrophq-dashboard-launch-d8b3a2c8eec9), we learned that we solved only one part of the onboarding problem for our customers: getting crypto to try out a dapp. We figured that installing separate software (Chrome extension or download a mobile app) to try a dapp is too much to ask mainstream users for.    
  
That's why we for the scope of the IDEO+CoinList hackathon decided to solve this problem by building a white-label wallet widget (think Intercom, but for crypto wallet), which any dapp can easily customize and integrate natively. We believe in combination with linkdrop campaigns the webwallet will provide dapps the powerful tooling to attract and retain non-crypto users.  

## Wallet features
- White-label: configure and integrate in minutes via widget/SDK  
- Custom design and ENS domain   
- Based on Meta Txs for the best UX: gasless transactions, built-in modules and more  
- Google Drive for non-custodial recovery  
- ENS Login for dapps interoperability. Among other wallet teams (including Authereum, Portis, Torus) we're working on the new loign standard. [Learn more](https://ethereum-magicians.org/t/discussion-ens-login/3569)  
- Build-in on-ramping
- Native linkdrops (WIP, has good potential for p2p onboarding via shareable links and p2p double referral programs similar to Paypal, Uber, etc.)   

## Linkdrop + web-wallet = magical crypto onboarding    
1. Open the link in regular browser   
2. Sign in with google/icloud  
3. Get tokens in one click  

You’ve got crypto wallet, ENS to login to dapps and crypto to use the dapp in 3 clicks!!!

## Demo video of the Linkdrop + Web-wallet onboarding
[![Watch the video](https://img.youtube.com/vi/6V2DLXk6Tmo/maxresdefault.jpg)](https://youtu.be/6V2DLXk6Tmo)  
https://youtu.be/6V2DLXk6Tmo


## Try it out
- A demo dapp integrating the wallet widget - https://zrx-instant-demo.linkdrop.io/. It's based on ZRX Instant. 
- Web-wallet - https://demo.wallet.linkdrop.io/

## Code structure

**Wallet-codebase (in scope for the IDEO+CoinList hackathon):**
- [wallet](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/apps/app-claim) - web-wallet widget code
- [wallet-provider](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/apps/app-claim) - web3 provider for dapps to integrate the widget wallet
- [Dapp example](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/apps/app-claim) - to show how dapps can use linkdrop campaigns and web-wallet in combination for the best onboarding experience, we've build an example dapp based on the 0x Instant. We've deployed it publicly here - https://zrx-instant-demo.linkdrop.io/

**Original Linkdrop-specific codebase:**
- [Contracts](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/contracts) - linkdrop contracts
- [Server](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/server) - node.js server application that relays claiming transactions so that end-users don't need to have ether to claim linkdrops
- [SDK](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/sdk) - a JS library to generate and claim links (used in web apps)
- [Scripts](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/scripts)  - scripts for setting up, deploying, generating links and claiming linkdrops
- [Configs](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/configs) - configs used in other components (SDK, server, web apps)

## Disclaimer
This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.

## License
The current codebase is released under the [GPL 3.0 license](https://www.gnu.org/licenses/gpl-3.0.en.html)
