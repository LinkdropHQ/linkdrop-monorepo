import {
  getLinkdropMasterWallet,
  getProvider,
  getString,
  getInt
} from './utils'
import { LinkdropSDK } from '@linkdrop/sdk'
import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
const CAMPAIGN_ID = getInt('CAMPAIGN_ID')
const PROVIDER = getProvider()
const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')
const CHAIN = getString('CHAIN')
const LINKDROP_MASTER_PRIVATE_KEY = getString('linkdropMasterPrivateKey')
const JSON_RPC_URL = getString('jsonRpcUrl')

const linkdropSDK = LinkdropSDK({
  linkdropMasterAddress: new ethers.Wallet(LINKDROP_MASTER_PRIVATE_KEY).address,
  chain: CHAIN,
  jsonRpcUrl: JSON_RPC_URL,
  factoryAddress: FACTORY_ADDRESS
})

const deployProxyIfNeeded = async spinner => {
  const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

  // check that proxy address is deployed
  const code = await PROVIDER.getCode(proxyAddress)

  if (code === '0x') {
    if (spinner) {
      spinner.info(term.bold.str(`Deploying proxy: ^g${proxyAddress}`))
    }
    const factoryContract = new ethers.Contract(
      FACTORY_ADDRESS,
      LinkdropFactory.abi,
      LINKDROP_MASTER_WALLET
    )
    const tx = await factoryContract.deployProxy(CAMPAIGN_ID)
    if (spinner) {
      spinner.info(term.bold.str(`Tx hash: ^g${tx.hash}`))
    }
  }
}

export default deployProxyIfNeeded
