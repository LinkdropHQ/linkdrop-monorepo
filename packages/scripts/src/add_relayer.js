import LinkdropFactory from '../../contracts/build/LinkdropFactory'
import { terminal as term } from 'terminal-kit'
import { getLinkdropMasterWallet, newError, getString } from './utils'
import { ethers } from 'ethers'
import ora from 'ora'

ethers.errors.setLogLevel('error')

const LINKDROP_MASTER_WALLET = getLinkdropMasterWallet()

const RELAYER_ADDRESS = '0x2C5641c0075b7E9D25C5f597b4D80B7A5a53Cea1'

const FACTORY_ADDRESS = getString('FACTORY_ADDRESS')

export const deploy = async () => {
  if (RELAYER_ADDRESS == null || RELAYER_ADDRESS === '') {
    throw new Error('Please provide relayer address')
  }

  let factory
  let tx

  let spinner = ora({
    text: term.bold.green.str('Adding new relayer to factory whitelist'),
    color: 'green'
  })

  spinner.start()

  // Deploy contract
  try {
    factory = new ethers.Contract(
      FACTORY_ADDRESS,
      LinkdropFactory.abi,
      LINKDROP_MASTER_WALLET
    )

    tx = await factory.addRelayer(RELAYER_ADDRESS)
  } catch (err) {
    spinner.fail(term.bold.red.str('Failed to deploy contract'))
    throw newError(err)
  }

  spinner.succeed(
    term.bold.str(`Added ${RELAYER_ADDRESS} to whitelisted relayers`)
  )

  term.bold(`Tx Hash: ^g${tx.hash}\n`)
}

deploy()
