import LinkdropMastercopy from '../../contracts/build/LinkdropMastercopy'
import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import configs from '../../../configs'

const scriptsConfig = configs.get('scripts')
const scriptsConfigPath = configs.getPath('scripts')

const appConfig = configs.get('app')
const appConfigPath = configs.getPath('app')

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()

export const deploy = async () => {
  let spinner, factory, masterCopy, txHash

  try {
    spinner = ora({
      text: term.bold.green.str('Deploying linkdrop contract master copy'),
      color: 'green'
    })

    spinner.start()

    // Deploy contract
    factory = new ethers.ContractFactory(
      LinkdropMastercopy.abi,
      LinkdropMastercopy.bytecode,
      LINKDROP_MASTER_WALLET
    )

    masterCopy = await factory.deploy({
      gasLimit: 4500000,
      gasPrice: ethers.utils.parseUnits('7', 'gwei')
    })

    await masterCopy.deployed()
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Deployed master copy at ^g${masterCopy.address}`)
  )

  txHash = masterCopy.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save to scripts config
  scriptsConfig.masterCopy = masterCopy.address

  fs.writeFile(scriptsConfigPath, JSON.stringify(scriptsConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${scriptsConfigPath}\n`)
  })

  // Save to app config
  appConfig.masterCopy = masterCopy.address
  fs.writeFile(appConfigPath, JSON.stringify(appConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${appConfigPath}\n`)
  })

  return masterCopy.address
}

deploy()
