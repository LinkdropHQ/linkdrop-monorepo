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
  LINKS_NUMBER,
  SENDER_PRIVATE_KEY
} = config

const sender = new ethers.Wallet(SENDER_PRIVATE_KEY)

const claim = async () => {
  let spinner

  try {
    const linkNumber = getLinkNumber(LINKS_NUMBER - 1)
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
      linkId,
      nativeTokensAmount,
      tokensAmount,
      tokenId,
      feeAmount,
      expiration,
      signerSignature,
      linkdropContract
    } = await getUrlParams('erc20', linkNumber)

    const linkdropSDK = new LinkdropSDK({
      senderAddress: sender.address,
      chain: CHAIN,
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST,
      factoryAddress: FACTORY_ADDRESS
    })

    const { success, txHash } = await linkdropSDK.claim({
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST,
      token,
      nft,
      feeToken,
      feeReceiver,
      linkId,
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

claim()
