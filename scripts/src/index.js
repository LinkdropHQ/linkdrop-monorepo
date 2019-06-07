import LinkdropSDK from '../../sdk/src/index'
import { terminal as term } from 'terminal-kit'
const ethers = require('ethers')
const fs = require('fs')
const fastcsv = require('fast-csv')
const path = require('path')
const configPath = path.resolve(__dirname, '../../configs/scripts.config.json')
const config = require(configPath)

ethers.errors.setLogLevel('error')

const newError = message => {
  const error = new Error(term.red.bold.str(message))
  return error
}

let {
  chainId,
  linkdropMasterPrivateKey,
  weiAmount,
  tokenAddress,
  tokenAmount,
  linksNumber,
  jsonRpcUrl,
  host,
  nftAddress,
  nftIds,
  isApprove,
  version
} = config

const expirationTime = 1900000000000000

export const generateLinksETH = async () => {
  if (chainId === null || chainId === '') {
    throw newError('Please provide chain id')
  }

  if (linksNumber === null || linksNumber === '') {
    throw newError('Please provide links number')
  }

  if (
    isApprove === null ||
    (String(isApprove) !== 'true' && String(isApprove) !== 'false')
  ) {
    throw newError('Please provide valid isApprove argument')
  }

  tokenAddress = ethers.constants.AddressZero
  tokenAmount = 0

  let links = []

  for (let i = 0; i < linksNumber; i++) {
    let {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await LinkdropSDK.generateLink({
      jsonRpcUrl,
      chainId,
      host,
      linkdropMasterPrivateKey,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      isApprove
    })

    let link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }

  // Save links to csv
  const filename = path.join(__dirname, '../output/linkdrop_eth.csv')

  try {
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    term(`File ^m${filename} has been succesfully updated`)
  } catch (err) {
    console.error(err)
  }

  return links
}

export const generateLinksERC20 = async () => {
  if (chainId === null || chainId === '') {
    throw newError('Please provide chain id')
  }

  if (linksNumber === null || linksNumber === '') {
    throw newError('Please provide links number')
  }

  if (
    isApprove === null ||
    (String(isApprove) !== 'true' && String(isApprove) !== 'false')
  ) {
    throw newError('Please provide valid isApprove argument')
  }

  let links = []

  for (let i = 0; i < linksNumber; i++) {
    let {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await LinkdropSDK.generateLink({
      jsonRpcUrl,
      chainId,
      host,
      linkdropMasterPrivateKey,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      isApprove
    })

    let link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }

  // Save links to csv
  const filename = path.join(__dirname, '../output/linkdrop_erc20.csv')

  try {
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    term(`File ^m${filename} has been succesfully updated`)
  } catch (err) {
    console.error(err)
  }

  return links
}

export const generateLinksERC721 = async () => {
  if (chainId === null || chainId === '') {
    throw newError('Please provide chain id')
  }

  if (nftIds == null || nftIds === '' || nftIds === '[]') {
    throw newError('Please provide NFT ids')
  }

  if (
    isApprove === null ||
    (String(isApprove) !== 'true' && String(isApprove) !== 'false')
  ) {
    throw newError('Please provide valid isApprove argument')
  }

  let links = []
  let tokenIds = JSON.parse(nftIds)

  for (let i = 0; i < tokenIds.length; i++) {
    let {
      url,
      linkId,
      linkKey,
      linkdropSignerSignature
    } = await LinkdropSDK.generateLinkERC721({
      jsonRpcUrl,
      chainId,
      host,
      linkdropMasterPrivateKey,
      weiAmount,
      nftAddress,
      tokenId: tokenIds[i],
      expirationTime,
      version,
      isApprove
    })

    let link = { i, linkId, linkKey, linkdropSignerSignature, url }
    links.push(link)
  }
  // Save links to csv
  const filename = path.join(__dirname, '../output/linkdrop_erc721.csv')

  try {
    const ws = fs.createWriteStream(filename)
    fastcsv.write(links, { headers: true }).pipe(ws)
    term(`File ${path.parse(filename).base} has been succesfully updated`)
  } catch (err) {
    console.error(err)
  }
  return links
}
