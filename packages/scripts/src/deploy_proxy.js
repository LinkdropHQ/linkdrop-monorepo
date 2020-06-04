import LinkdropSDK from '@linkdrop/sdk'
import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'

import config from '../config'

const {
  JSON_RPC_URL,
  SENDER_PRIVATE_KEY,
  CHAIN,
  FACTORY_ADDRESS,
  CAMPAIGN_ID
} = config

const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)
const sender = new ethers.Wallet(SENDER_PRIVATE_KEY, provider)

const linkdropSDK = new LinkdropSDK({
  senderAddress: sender.address,
  chain: CHAIN,
  jsonRpcUrl: JSON_RPC_URL,
  factoryAddress: FACTORY_ADDRESS
})

const deployProxyIfNeeded = async spinner => {
  const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

  // check that proxy address is deployed
  const code = await provider.getCode(proxyAddress)

  if (code === '0x') {
    if (spinner) {
      spinner.info(term.bold.str(`Deploying proxy: ^g${proxyAddress}`))
    }
    const factoryContract = new ethers.Contract(
      FACTORY_ADDRESS,
      LinkdropFactory.abi,
      sender
    )
    const tx = await factoryContract.deployProxy(CAMPAIGN_ID)

    if (spinner) {
      spinner.info(term.bold.str(`Tx hash: ^g${tx.hash}`))
    }
  }
}

export default deployProxyIfNeeded
