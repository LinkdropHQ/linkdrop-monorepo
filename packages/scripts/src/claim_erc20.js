import { LinkdropSDK } from '@linkdrop/sdk'
import ora from 'ora'
import { ethers } from 'ethers'
import { terminal as term } from 'terminal-kit'
import { newError, getString, getUrlParams, getLinkNumber } from './utils'

ethers.errors.setLogLevel('error')

const JSON_RPC_URL = getString('jsonRpcUrl')
const CHAIN = getString('CHAIN')
const API_HOST = getString('API_HOST')
const RECEIVER_ADDRESS = getString('receiverAddress')
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')
const LINKS_NUMBER = getString('linksNumber')

const claim = async (receiverAddress = RECEIVER_ADDRESS) => {
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
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId
    } = await getUrlParams('erc20', linkNumber)

    const linkdropSDK = LinkdropSDK({
      linkdropMasterAddress,
      chain: CHAIN,
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST,
      factoryAddress: FACTORY_ADDRESS
    })

    const { errors, success, txHash } = await linkdropSDK.claim({
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress,
      campaignId
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
