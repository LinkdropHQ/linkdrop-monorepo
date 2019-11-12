import LinkdropSDK from '@linkdrop/sdk'
import ora from 'ora'
import { ethers } from 'ethers'
import { terminal as term } from 'terminal-kit'
import { newError, getUrlParams, getLinkNumber } from './utils'
import config from '../config'

ethers.errors.setLogLevel('error')

const {
  JSON_RPC_URL,
  CHAIN,
  API_HOST,
  RECEIVER_ADDRESS,
  FACTORY_ADDRESS,
  TOKEN_IDS,
  SENDER_PRIVATE_KEY
} = config

const sender = new ethers.Wallet(SENDER_PRIVATE_KEY)

const claimERC721 = async () => {
  let spinner

  try {
    const linkNumber = getLinkNumber(JSON.parse(TOKEN_IDS).length - 1)

    term.bold(`Claiming link #${linkNumber}:\n`)

    spinner = ora({
      text: term.bold.green.str('Claiming\n'),
      color: 'green'
    })
    spinner.start()

    const {
      token,
      nft,
      feeToken,
      feeReceiver,
      linkKey,
      nativeTokensAmount,
      tokensAmount,
      tokenId,
      feeAmount,
      expiration,
      signerSignature,
      linkdropContract
    } = await getUrlParams('erc721', linkNumber)

    const linkdropSDK = new LinkdropSDK({
      senderAddress: sender.address,
      factoryAddress: FACTORY_ADDRESS,
      chain: CHAIN,
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST
    })

    const { success, txHash } = await linkdropSDK.claim({
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST,
      token,
      nft,
      feeToken,
      feeReceiver,
      linkKey,
      nativeTokensAmount,
      tokensAmount,
      tokenId,
      feeAmount,
      expiration,
      signerSignature,
      receiverAddress: RECEIVER_ADDRESS,
      linkdropContract
    })

    if (success === true && txHash) {
      spinner.succeed(term.bold.str('Submitted claim transaction'))
      term.bold(`Tx hash: ^g${txHash}\n`)
    }
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to claim'))
    throw newError(err)
  }
}

claimERC721()
