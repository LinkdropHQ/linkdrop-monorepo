import NFTMock from '../../contracts/build/NFTMock'
import { terminal as term } from 'terminal-kit'
import { newError } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'

import config from '../config'

ethers.errors.setLogLevel('error')

const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL)
const sender = new ethers.Wallet(config.SENDER_PRIVATE_KEY, provider)

export const deploy = async () => {
  let spinner, factory, nftMock

  try {
    spinner = ora({
      text: term.bold.green.str('Deploying mock ERC721 token contract'),
      color: 'green'
    })

    spinner.start()

    // Deploy contract
    factory = new ethers.ContractFactory(NFTMock.abi, NFTMock.bytecode, sender)

    nftMock = await factory.deploy({
      gasLimit: 4500000,
      gasPrice: ethers.utils.parseUnits('5', 'gwei')
    })

    await nftMock.deployed()
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(term.bold.str(`Deployed mock NFT at ^g${nftMock.address}`))

  const txHash = nftMock.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  config.NFT_ADDRESS = nftMock.address
  fs.writeFile(config.path, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${config.path}\n`)
  })

  return nftMock.address
}

deploy()
