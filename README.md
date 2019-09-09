# Linkdrop Monorepo
Monorepo for linkdrop.io, a service enabling send and receive Ether, ERC20 and/or ERC721 tokens via shareable links and QR codes.
This repository is a monorepo including the sdk, server, smart contracts and web apps (demo and claming app).

## Disclaimer
This is a work in progress. Expect breaking changes. The code has not been audited and therefore can not be considered secure.

## Structure
- [Contracts](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/contracts) - linkdrop contracts
- [Server](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/server) - node.js server application that relays claiming transactions so that end-users don't need to have ether to claim linkdrops
- [SDK](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/sdk) - a JS library to generate and claim links (used in web apps)
- [Web apps](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/apps) - web apps to interact with linkdrop service for end-users.  
- [Scripts](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/scripts)  - scripts for setting up, deploying, generating links and claiming linkdrops
- [Configs](https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/configs) - configs used in other components (SDK, server, web apps)


## Building, running & testing locally 

To build and run locally, first follow the instructions in `scripts` - https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/scripts  
After server is running, you can follow instructions in `apps` to serve front-end apps (demo and claiming apps) - https://github.com/LinkdropHQ/linkdrop-monorepo/tree/master/packages/apps

## Dashboard
You can generate new campaign at https://dashboard.linkdrop.io. The Dashboard supports Mainnet and Rinkeby Test networks right now. Let us know if you're intested in supporting other networks by sendding an email to hi@linkdrop.io


## License
The current codebase is released under the [GPL 3.0 open-source license](https://www.gnu.org/licenses/gpl-3.0.en.html)
