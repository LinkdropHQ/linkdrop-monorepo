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
[![Watch the video](https://img.youtube.com/vi/nOerM7h9Ih8/maxresdefault.jpg)](https://youtu.be/nOerM7h9Ih8)  
https://www.youtube.com/watch?v=nOerM7h9Ih8


## Adoptathon Update
 
For the first week of the Adoptathon our team initially user-tested the widget with crypto and non-crypto friends in person. On Friday (09/13/2019) our team attended the DeFi meetup in Saint-Petersburg, where we user-tested our widget with ~20 users in person. We have received in general good response, people understood the value of our product straight away.   

The interviews uncovered some UX friction with Google Drive backup process, leading us to make changes to our app and split the signup and adding Google Drive permissions in two separate screens.  

During the second week we:  
- Introduced the changes and polished the widget.  
- Added a landing page for the widget - https://linkdrop.io/wallet-widget/  
- Published the blog post - https://medium.com/linkdrophq/ux-study-white-label-wallet-widget-673ac38796e8  
- Shared it on socials: Twitter, Reddit, Telegram Groups 
- PM'd about 30 dapp developers in the community to get early feedback on the widget  

This gave us lot’s of insights into dapp developer needs and good feedback for the direction of the widget. We started a survey to confirm our finding and continue collecting responses - https://linkdrop.typeform.com/to/au8QUt  

Finally and the most important, we had a call with our first integrating partner and closed the deal: Snark.Art is going to integrate our widget in the next project launching in October.  

## Stats:  

Medium blog post: 147 views, 84 reads, 11 fans  
Requests to try the demo collected on the landing page: 11  
Users tried the demo: 45 https://etherscan.io/address/0x74f1a37a2324857c262e9762e84db4b08273b6ae    
Potential integrations: 5 (kauri.io, fusenet.io, zerion.io, dex.ag, pooltogether.io)  
1 confirmed integration starting from mid-October = Snark.Art 

## Collected feedback and identified issues 

Some users had issues with Google Sign-In on Safari. The short-term fix was to require users to clear browser cache. However, we will keep searching for a stable solution to this problem. 

All users that tried the demo had Google account. However, not all of them were logged in on their testing device. This created a minor issue, but almost all of the users were able to log in with Google during our tests. 

Access to Google Drive permission is still scary for users and needs more tuning. We will continue iterating on the flow.  

One user suggested looking into the new Apple Sign-In API instead of Google Drive, as he said he would be more comfortable with storing his private key that way. We plan to look into that to see if we can suggest Apple users Apple Sign-In as the Google Sign-In replacement. 

Not all UI elements were clear to users initially, we’re going to work on it further. 

## Next steps

We will continue iterating on the sign-up process to make it as frictionless as possible. We plan to: 
- Add an alternative with email+password combination  
- Look into new Apple Sign-In API for Apple users 
- Change the description on the Google Drive permissions screen to make it clearer why we’re asking for the permission  

For the next month, we’re going to focus on going from hackathon PoC to production-ready version, as in October we plan to release our first real integration with Snark.Art. 

For the PoC we based our wallet contracts on the Universal Login SDK. However, for production release, we’re going to migrate to Gnosis Safe contracts as:   
- They’re audited and formally verified  
- They are based on a modular architecture, which is better in the long term  
- We’ve already worked on the linkdrop module for the Gnosis Safe. This will get built-in native linkdrops allowing p2p onboarding links and Paypal-like double referral programs.   

In the meantime, we will continue iterating on the product, testing it with users and looking for new integrations.  


## Try it out
- [Test out the Wallet-Widget (Alpha)](https://linkdrop.io/wallet-widget)


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
