/* eslint-disable no-undef */
import { newError } from './utils'
import LinkdropSDK from '@linkdrop/sdk'
import ora from 'ora'
import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
import deployProxyIfNeeded from './deploy_proxy'
import config from '../config'

const {
  JSON_RPC_URL,
  NATIVE_TOKENS_AMOUNT,
  SENDER_PRIVATE_KEY,
  CHAIN,
  FACTORY_ADDRESS,
  LINKS_NUMBER,
  CAMPAIGN_ID,
  FEE_AMOUNT,
  CALLBACK_DATA
} = config

const nativeTokensAmount = ethers.utils.bigNumberify(
  NATIVE_TOKENS_AMOUNT.toString()
)
const feeAmount = ethers.utils.bigNumberify(FEE_AMOUNT.toString())

const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)
const sender = new ethers.Wallet(SENDER_PRIVATE_KEY, provider)

const linkdropSDK = new LinkdropSDK({
  senderAddress: sender.address,
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

    const cost = nativeTokensAmount.mul(LINKS_NUMBER)

    let amountToSend

    const tokenSymbol = 'ETH'
    const tokenDecimals = 18
    const proxyBalance = await provider.getBalance(proxyAddress)

    // check that proxy address is deployed
    if (String(CAMPAIGN_ID) !== '0') await deployProxyIfNeeded(spinner)

    if (proxyBalance.lt(cost)) {
      // Transfer ethers
      amountToSend = cost.sub(proxyBalance)

      spinner.info(
        term.bold.str(
          `Sending ${amountToSend /
            Math.pow(10, tokenDecimals)} ${tokenSymbol} to ^g${proxyAddress}`
        )
      )

      tx = await sender.sendTransaction({
        to: proxyAddress,
        value: amountToSend,
        gasLimit: 23000
      })

      term.bold(`Tx Hash: ^g${tx.hash}\n`)
    }

    const FEE_COSTS = feeAmount.mul(LINKS_NUMBER)

    // Transfer fee coverage
    spinner.info(term.bold.str(`Sending fee costs to ^g${proxyAddress}`))

    tx = await sender.sendTransaction({
      to: proxyAddress,
      value: FEE_COSTS,
      gasLimit: 23000,
      gasPrice: ethers.utils.parseUnits('2', 'gwei')
    })

    term.bold(`Tx Hash: ^g${tx.hash}\n`)

    // Generate links
    const links = []

    for (let i = 0; i < LINKS_NUMBER; i++) {
      const {
        url,
        linkId,
        linkKey,
        signerSignature
      } = await linkdropSDK.generateLink({
        signingKeyOrWallet: sender.privateKey,
        nativeTokensAmount: NATIVE_TOKENS_AMOUNT,
        campaignId: CAMPAIGN_ID,
        feeAmount: FEE_AMOUNT,
        data: CALLBACK_DATA
      })

      const link = { i, linkId, linkKey, signerSignature, url }
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
