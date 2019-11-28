/* eslint-disable no-undef */
import path from 'path'
import fs from 'fs'
import { ethers } from 'ethers'

const configPath = path.resolve(__dirname, './config.json')

// If config file does not exist, create it and fill with sample config content
if (!fs.existsSync(configPath)) {
  fs.copyFileSync(`${configPath}.sample`, configPath, err => {
    if (err) throw new Error(err)
  })
}

const config = require(configPath)

const getChainId = chain => {
  switch (chain) {
    case 'mainnet':
      return 1
    case 'ropsten':
      return 3
    case 'rinkeby':
      return 4
    case 'goerli':
      return 5
    case 'kovan':
      return 42
    case 'xdai':
      return 100
    default:
      return null
  }
}

if (config.CHAIN) {
  config.CHAIN_ID = getChainId(config.CHAIN)
}

if (config.SENDER_PRIVATE_KEY) {
  config.SENDER_ADDRESS = new ethers.Wallet(config.SENDER_PRIVATE_KEY).address
}

export default { ...config, path: configPath }
