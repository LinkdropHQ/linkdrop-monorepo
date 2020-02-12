import { terminal as term } from 'terminal-kit'
import { ethers } from 'ethers'
import path from 'path'
const csvToJson = require('csvtojson')
const queryString = require('query-string')

const config = require('../../../configs').get('scripts')

export const newError = message => {
  const error = new Error(term.red.bold.str(message))
  return error
}

export const getString = key => {
  if (config[key] == null || config[key] === '') {
    throw newError(`Please provide ${key}`)
  }

  return config[key]
}

export const getBool = key => {
  if (config[key] == null || config[key] === '') {
    throw newError(`Please provide ${key}`)
  }

  if (String(config[key]) !== 'true' && String(config[key]) !== 'false') {
    throw newError(`Please provide valid ${key} argument`)
  }

  return config[key]
}

export const getInt = key => {
  if (config[key] == null || config[key] === '') {
    throw newError(`Please provide ${key}`)
  }
  const intNumber = parseInt(config[key])
  if (intNumber == null) throw newError(`Please provide valid ${key}`)
  return intNumber
}

export const getProvider = () => {
  const JSON_RPC_URL = getString('jsonRpcUrl')
  const provider = new ethers.providers.JsonRpcProvider(JSON_RPC_URL)
  return provider
}

export const getLinkdropMasterWallet = () => {
  const LINKDROP_MASTER_PRIVATE_KEY = getString('linkdropMasterPrivateKey')
  const provider = getProvider()

  const linkdropMasterWallet = new ethers.Wallet(
    LINKDROP_MASTER_PRIVATE_KEY,
    provider
  )
  return linkdropMasterWallet
}

export const getInitCode = () => {
  return '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
}

export const getExpirationTime = () => {
  return 12345678910
}

// Get linkdrop parameters
export const getUrlParams = async (type, i) => {
  const csvFilePath = path.resolve(__dirname, `../output/linkdrop_${type}.csv`)
  const jsonArray = await csvToJson().fromFile(csvFilePath)
  const rawUrl = jsonArray[i].url.replace('#', '')
  const parsedUrl = await queryString.extract(rawUrl)
  const parsed = await queryString.parse(parsedUrl)
  return parsed
}

export const getLinkNumber = maxNumber => {
  const args = process.argv.slice(2)
  if (args.length < 1) {
    return Math.floor(Math.random() * maxNumber + 1)
  }
  const n = args[0]
  const number = Number(n)
  if (isNaN(number)) {
    throw new Error(`Wrong link number argument provided ${n}`)
  }
  return number
}

export class LinkParams {
  constructor ({
    token,
    nft,
    feeToken,
    feeReceiver,
    linkId,
    nativeTokensAmount,
    tokensAmount,
    tokenId,
    feeAmount,
    expiration,
    data
  }) {
    this.token = token
    this.nft = nft
    this.feeToken = feeToken
    this.feeReceiver = feeReceiver
    this.linkId = linkId
    this.nativeTokensAmount = nativeTokensAmount
    this.tokensAmount = tokensAmount
    this.tokenId = tokenId
    this.feeAmount = feeAmount
    this.expiration = expiration
    this.data = data
  }
}
