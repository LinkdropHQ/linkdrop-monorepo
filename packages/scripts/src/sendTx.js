import { WalletSDK } from '@linkdrop/sdk'
import { ethers } from 'ethers'

const provider = new ethers.providers.JsonRpcProvider(
  'https://rinkeby.infura.io'
)

const walletSDK = new WalletSDK(
  '0x5a50fA008E4c0d829AfEBFa4A425d3A8CA907c67',
  '2748724e62a450ee1b93f6803962fd390785064cddc277d87fcc6cfe73b2fbbe',
  'rinkeby'
)

async function main () {
  await walletSDK.executeTransaction({
    to: '0xdcF0E59De5518FAB06b8E398B02BC7240921cF48',
    value: '10'
  })
}

main()
