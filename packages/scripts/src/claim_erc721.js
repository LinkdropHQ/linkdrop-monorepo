import {LinkdropSDK} from '@linkdrop/sdk'
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
const NFT_IDS = getString('nftIds')

const claimERC721 = async () => {
  let spinner
  try {
    let LINKS_NUMBER = JSON.parse(NFT_IDS).length - 1
    const linkNumber = getLinkNumber(LINKS_NUMBER)
    term.bold(`Claiming link #${linkNumber}:\n`)
    spinner = ora({
      text: term.bold.green.str('Claiming\n'),
      color: 'green'
    })
    spinner.start()
    const {
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId
    } = await getUrlParams('erc721', linkNumber)

    const linkdropSDK = new LinkdropSDK({
      linkdropMasterAddress,
      factoryAddress: FACTORY_ADDRESS,
      chain: CHAIN,
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST
    })

    const { errors, success, txHash } = await linkdropSDK.claimERC721({
      jsonRpcUrl: JSON_RPC_URL,
      apiHost: API_HOST,
      weiAmount,
      nftAddress,
      tokenId,
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

claimERC721()
