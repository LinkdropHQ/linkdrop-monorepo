export default {
  titles: {
    needWallet: 'You need a wallet to claim tokens',
    haveAnother: 'Have another wallet?',
    claimTo: 'Claim to: <span>{{wallet}}</span>',
    transactionInProcess: 'Transaction is processing',
    claiming: 'Claiming...',
    claimingNFT: 'Claiming NFT...',
    instructions: 'It may take a few minutes.',
    seeDetails: 'See details on <a target="_blank" href={{transactionLink}}>Etherscan</a>',
    seeDetailsBlockscout: 'See details on <a target="_blank" href={{transactionLink}}>Blockscout</a>',
    tokensClaimed: '<span>{{tokens}}</span> claimed',
    claimFailed: 'Claiming Failed',
    howToClaim: 'How to claim tokens to {{wallet}}',
    formTitle: 'Subscribe for new giveaways',
    agreeWithTerms: 'By claiming you agree to the <a target="_blank" href={{href}}>Terms & Privacy</a>',
    yourEmail: 'Your Email',
    subscribed: 'Subscribed!',
    failed: 'Failed!',
    fakeCheckbox: 'Let me know about new giveaways',
    connectWallet: 'Connect your wallet<br>via {{connector}}',
    youNeedEth: 'You need an Ethereum wallet to claim your NFT',
    claimInstruction: 'Your wallet will receive 1 NFT and .005 ETH to play with it',
    howToSeeTokens: 'Now you can see your NFT in<br><a target="_blank" href={{openseaHref}}>Opensea</a> or <a target="_blank" href="{{raribleHref}}">Rarible</a>',
    or: 'or',
    viewTheEntireSeries: 'View the entire <a href={{href}}>series</a>',
    congrats: 'Congrats!',
    nftClaimed: 'NFT Claimed',
    variantInstructions: {
      _1: '1. Copy this page URL',
      _2: '2. Paste it in the dApp browser after the wallet is installed'
    }
  },
  buttons: {
    useWallet: 'Use {{wallet}}',
    copyLink: 'Copy link',
    goTo: 'Go to {{dapp}}',
    connect: 'Connect'
  },
  errors: {
    LINKDROP_PROXY_CONTRACT_PAUSED: {
      title: 'Campaign is paused',
      description: ''
    },
    INVALID_TOKEN_ADDRESS: {
      title: 'Invalid token address',
      description: ''
    },
    LINK_CLAIMED: {
      title: 'Link claimed',
      description: ''
    },
    INSUFFICIENT_ETHERS: {
      title: 'Insufficient ethers',
      description: ''
    },
    INSUFFICIENT_TOKENS: {
      title: 'Insufficient tokens',
      description: ''
    },
    INSUFFICIENT_ALLOWANCE: {
      title: 'Insufficient allowance',
      description: ''
    },
    INVALID_LINKDROP_SIGNER_SIGNATURE: {
      title: 'Invalid Linkdrop signer signature',
      description: ''
    },
    INVALID_RECEIVER_SIGNATURE: {
      title: 'Invalid receiver signature',
      description: ''
    },
    SERVER_ERROR_OCCURED: {
      title: 'Server error occured',
      description: ''
    },
    LINK_EXPIRED: {
      title: 'Expired',
      description: 'Sorry, link is expired'
    },
    LINK_CANCELED: {
      title: 'Canceled',
      description: 'Sorry, link is canceled'
    },
    LINK_FAILED: {
      title: 'Failed',
      description: 'Oops, something went wrong'
    },
    LINK_INVALID: {
      title: 'Invalid Link',
      description: 'Please check the format of claim link'
    },
    NETWORK_NOT_SUPPORTED: {
      title: 'Network is not supported',
      description: 'Switch to {{network}}',
      instructions: {
        _1: '1. Go to <span>Settings</span> in your Wallet',
        _2: '2. Switch Network to <span>{{network}}</span>',
        _3: '3. Back to wallet’s DApp browser then reload the claiming page and follow instructions'
      }
    },
    NEED_METAMASK: {
      title: 'You need a wallet to claim tokens',
      description: '',
      instructions: {
        _1: '1. Download <a href="https://metamask.io/" target="_blank">Metamask</a>',
        _2: '2. Then just reload the claim page'
      }
    },
    CONNECTOR_NETWORK_NOT_SUPPORTED: {
      title: 'Switch to {{network}} Network',
      description: '',
      instructions: {
        _1: '1. Go to <span>Settings</span> in your Wallet',
        _2: '2. Switch Network to <span>{{network}}</span> (if supported)',
        _3: '3. Back to your browser or wallet’s DApp browser then reload the claiming page and follow instructions'
      }
    }
  },
  walletsInstructions: {
    common: {
      _1: {
        withUrl: '1. Download <a href={{href}}>{{title}}</a>',
        withNoUrl: '1. Download {{title}}'
      },
      _2: '2. Copy&Paste the claiming link in a wallet’s DApp browser'
    },
    deepLink: {
      _1: '1. Download <a href={{href}}>{{title}}</a>.',
      _2: '2. Return here and tap on the button below'
    }
  }
}
