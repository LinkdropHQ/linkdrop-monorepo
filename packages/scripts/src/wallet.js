import { LinkdropSDK, WalletSDK } from '@linkdrop/sdk'

import ora from 'ora'

import { ethers } from 'ethers'
import { terminal as term } from 'terminal-kit'
import { newError, getString, getUrlParams, getLinkNumber } from './utils'
//
ethers.errors.setLogLevel('error')

const JSON_RPC_URL = getString('jsonRpcUrl')
const CHAIN = getString('CHAIN')
const API_HOST = getString('API_HOST')
const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')
const LINKS_NUMBER = getString('linksNumber')
const walletSDK = new WalletSDK()

async function main () {
  //

  const mnemonic = ethers.Wallet.createRandom().mnemonic

  // const mnemonic = 'tired error before token warfare lens news fault visa trip chaos inform'
  console.log('mnemonic: ', mnemonic)

  //   const first = ethers.Wallet.fromMnemonic(mnemonic)
  //   console.log('first: ', first.address)
  //   const second = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/1")
  //   console.log('second: ', second.address)
  //   const third = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/2")
  //   console.log('third: ', third.address)

  const owners = []

  for (let i = 0; i < 3; i++) {
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${i}`)
    const address = wallet.address
    const privateKey = wallet.privateKey
    console.log('address: ', address)
    console.log('privateKey: ', privateKey)
    owners.push(address)
  }
  const threshold = 1
  const saltNonce = 1234

  const safeAddress = await walletSDK.getAddress({
    owners,
    threshold,
    saltNonce
  })
  console.log('Safe address: ', safeAddress)
  /// //
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
      receiverAddress: safeAddress,
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

main()
