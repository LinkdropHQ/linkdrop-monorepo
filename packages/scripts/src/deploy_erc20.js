import TokenMock from '../../contracts/build/TokenMock'
import { terminal as term } from 'terminal-kit'
import { newError } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import config from '../config'

const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL)
const sender = new ethers.Wallet(config.SENDER_PRIVATE_KEY, provider)

export const deploy = async () => {
  let spinner, factory, tokenMock

  try {
    spinner = ora({
      text: term.bold.green.str('Deploying mock ERC20 token contract'),
      color: 'green'
    })

    spinner.start()

    // Deploy contract
    factory = new ethers.ContractFactory(
      TokenMock.abi,
      TokenMock.bytecode,
      sender
    )

    tokenMock = await factory.deploy({
      gasLimit: 6000000
    })

    await tokenMock.deployed()
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Deployed mock token at ^g${tokenMock.address}`)
  )

  const txHash = tokenMock.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save changes
  config.TOKEN_ADDRESS = tokenMock.address
  fs.writeFile(config.path, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${config.path}\n`)
  })

  return tokenMock.address
}

deploy()
