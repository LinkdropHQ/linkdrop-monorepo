import {
  newError,
  getLinkdropMasterWallet,
  getExpirationTime,
  getProvider,
  getString,
  getInt
} from './utils'

import {LinkdropSDK} from '@linkdrop/sdk'
import ora from 'ora'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
import deployProxyIfNeeded from './deploy_proxy'

const JSON_RPC_URL = getString('jsonRpcUrl')
const CHAIN = getString('CHAIN')
const LINKDROP_MASTER_PRIVATE_KEY = getString('linkdropMasterPrivateKey')
const WEI_AMOUNT = getInt('weiAmount')
const LINKS_NUMBER = getInt('linksNumber')
const EXPIRATION_TIME = getExpirationTime()
const PROVIDER = getProvider()
const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()
const CAMPAIGN_ID = getInt('CAMPAIGN_ID')
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')
const GAS_FEE = ethers.utils.parseUnits('0.002')

const linkdropSDK = new LinkdropSDK({
  linkdropMasterAddress: new ethers.Wallet(LINKDROP_MASTER_PRIVATE_KEY).address,
  chain: CHAIN,
  jsonRpcUrl: JSON_RPC_URL,
  factoryAddress: FACTORY_ADDRESS
})

export const generate = async () => {
  let spinner, tx
  try {
    spinner = ora({
      text: term.bold.green.str('Generating links'),
      color: 'green'
    })
    spinner.start()

    const proxyAddress = linkdropSDK.getProxyAddress(CAMPAIGN_ID)

    let cost = WEI_AMOUNT * LINKS_NUMBER

    let amountToSend

    const tokenSymbol = 'ETH'
    const tokenDecimals = 18
    const proxyBalance = await PROVIDER.getBalance(proxyAddress)

    // check that proxy address is deployed
    await deployProxyIfNeeded(spinner)

    if (proxyBalance < cost) {
      // Transfer ethers
      amountToSend = cost - proxyBalance

      spinner.info(
        term.bold.str(
          `Sending ${amountToSend /
            Math.pow(10, tokenDecimals)} ${tokenSymbol} to ^g${proxyAddress}`
        )
      )

      tx = await LINKDROP_MASTER_WALLET.sendTransaction({
        to: proxyAddress,
        value: amountToSend,
        gasLimit: 23000
      })

      term.bold(`Tx Hash: ^g${tx.hash}\n`)
    }

    const FEE_COSTS = GAS_FEE.mul(LINKS_NUMBER)
    // Transfer fee coverage
    spinner.info(term.bold.str(`Sending fee costs to ^g${proxyAddress}`))

    tx = await LINKDROP_MASTER_WALLET.sendTransaction({
      to: proxyAddress,
      value: FEE_COSTS,
      gasLimit: 23000
    })

    term.bold(`Tx Hash: ^g${tx.hash}\n`)

    // Generate links
    let links = []

    for (let i = 0; i < LINKS_NUMBER; i++) {
      let {
        url,
        linkId,
        linkKey,
        linkdropSignerSignature
      } = await linkdropSDK.generateLink({
        signingKeyOrWallet: LINKDROP_MASTER_PRIVATE_KEY,
        weiAmount: WEI_AMOUNT,
        tokenAddress: ethers.constants.AddressZero,
        tokenAmount: 0,
        expirationTime: EXPIRATION_TIME,
        campaignId: CAMPAIGN_ID
      })

      let link = { i, linkId, linkKey, linkdropSignerSignature, url }
      links.push(link)
    }

    // Save links
    const dir = path.join(__dirname, '../output')
    const filename = path.join(dir, 'linkdrop_eth.csv')

    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      const ws = fs.createWriteStream(filename)
      fastcsv.write(links, { headers: true }).pipe(ws)
    } catch (err) {
      throw newError(err)
    }

    spinner.succeed(term.bold.str(`Generated and saved links to ^_${filename}`))

    return links
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to generate links'))
    throw newError(err)
  }
}

generate()
