import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import Linkdrop from '../../contracts/build/Linkdrop'
import { terminal as term } from 'terminal-kit'
import { newError } from './utils'
import { ethers } from 'ethers'
import ora from 'ora'
import config from '../config'

ethers.errors.setLogLevel('error')
const {
  MASTERCOPY_ADDRESS,
  FACTORY_ADDRESS,
  JSON_RPC_URL,
  SENDER_PRIVATE_KEY
} = config
const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)
const sender = new ethers.Wallet(SENDER_PRIVATE_KEY, provider)

export const set = async () => {
  let spinner, factory, masterCopy, tx

  try {
    spinner = ora({
      text: term.bold.green.str('Setting master copy address in factory'),
      color: 'green'
    })

    spinner.start()

    masterCopy = new ethers.Contract(MASTERCOPY_ADDRESS, Linkdrop.abi, sender)

    const initialized = await masterCopy.initialized()

    if (initialized === true) {
      return spinner.fail(term.bold.red.str('Master copy already initialized'))
    }

    factory = new ethers.Contract(FACTORY_ADDRESS, LinkdropFactory.abi, sender)

    tx = await factory.setMasterCopy(MASTERCOPY_ADDRESS, {
      gasLimit: 1200000
    })
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to set master copy address'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Set master copy address to ^g${masterCopy.address}`)
  )

  term.bold(`Tx Hash: ^g${tx.hash}\n`)

  return masterCopy.address
}

set()
