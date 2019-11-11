import LinkdropMastercopy from '../../contracts/build/LinkdropMastercopy'
import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError } from './utils'
import { ethers } from 'ethers'
import fs from 'fs'
import ora from 'ora'
import configs from '../../../configs'

import scriptsConfig from '../config'

const appConfig = configs.get('app')
const appConfigPath = configs.getPath('app')

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()

export const deploy = async () => {
  let spinner, factory, masterCopy

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
      gasPrice: ethers.utils.parseUnits('4', 'gwei')
    })

    await masterCopy.deployed()
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Deployed master copy at ^g${masterCopy.address}`)
  )

  const txHash = masterCopy.deployTransaction.hash
  term.bold(`Tx Hash: ^g${txHash}\n`)

  // Save to scripts config
  scriptsConfig.MASTERCOPY_ADDRESS = masterCopy.address

  fs.writeFile(scriptsConfig.path, JSON.stringify(scriptsConfig), err => {
    if (err) throw newError(err)
    term.bold(`Updated ^_${scriptsConfig.path}\n`)
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
