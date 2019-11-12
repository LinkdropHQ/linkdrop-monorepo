import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { terminal as term } from 'terminal-kit'
import { newError } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import configs from '../../../configs'

import config from '../config'

ethers.errors.setLogLevel('error')

const serverConfig = configs.get('server')
const serverConfigPath = configs.getPath('server')

const appConfig = configs.get('app')
const appConfigPath = configs.getPath('app')

const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL)
const sender = new ethers.Wallet(config.SENDER_PRIVATE_KEY, provider)

export const deploy = async () => {
  let factory, proxyFactory

  const spinner = ora({
    text: term.bold.green.str('Deploying linkdrop proxy factory contract'),
    color: 'green'
  })

  spinner.start()

  // Deploy contract
  try {
    factory = new ethers.ContractFactory(
      LinkdropFactory.abi,
      LinkdropFactory.bytecode,
      sender
    )

    proxyFactory = await factory.deploy(
      config.MASTERCOPY_ADDRESS,
      config.CHAIN_ID,
      {
        gasLimit: 4500000,
        gasPrice: ethers.utils.parseUnits('4', 'gwei')
      }
    )

    await proxyFactory.deployed()
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Deployed proxy factory at ^g${proxyFactory.address}`)
  )

  const txHash = proxyFactory.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save to scripts config
  config.FACTORY_ADDRESS = proxyFactory.address
  fs.writeFile(config.path, JSON.stringify(config), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${config.path}\n`)
  })

  // Save to server config
  serverConfig.FACTORY_ADDRESS = proxyFactory.address
  fs.writeFile(serverConfigPath, JSON.stringify(serverConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${serverConfigPath}\n`)
  })

  // Save to app config
  appConfig.FACTORY_ADDRESS = proxyFactory.address
  fs.writeFile(appConfigPath, JSON.stringify(appConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${appConfigPath}\n`)
  })

  return proxyFactory.address
}

deploy()
