// import WalletSDK from './WalletSDK'
// import { ethers } from 'ethers'

// const main = async () => {
//   const sdk = new WalletSDK()
//   //   const response = await sdk.createSafe(
//   //     '0xa208969d8f9e443e2b497540d069a5d1a6878f4e'
//   //   )
//   //   console.log('response: ', response)

//   const privateKey = undefined
//   const safe = '0x563df37ff1e6a70d6d0af364a9ca95c31ea61c94'
//   const response = await sdk.executeTx({
//     safe,
//     privateKey,
//     to: '0x646F6381010bA304cA1f912d6E7BB9972b4b6f56',
//     value: 1234
//   })
//   console.log({ response })
// }

// main()

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
    } = await getUrlParams('eth', linkNumber)

    const linkdropSDK = LinkdropSDK({
      linkdropMasterAddress,
      chain: CHAIN,
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST,
      factoryAddress: FACTORY_ADDRESS
    })

    const { errors, success, txHash } = await linkdropSDK.claim({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      receiverAddress: RECEIVER_ADDRESS,
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
