import { ethers } from 'ethers'
import * as util from 'ethereumjs-util'
import * as abi from 'ethereumjs-abi'
/**
 * Function to get encoded data to use in CreateAndAddModules library
 * @param {String} dataArray Data array concatenated
 */
export const encodeDataForCreateAndAddModules = dataArray => {
  const moduleDataWrapper = new ethers.utils.Interface([
    'function setup(bytes data)'
  ])
  // Remove method id (10) and position of data in payload (64)
  return dataArray.reduce(
    (acc, data) =>
      acc + moduleDataWrapper.functions.setup.encode([data]).substr(74),
    '0x'
  )
}

/**
 * @dev Function to get encoded params data from contract abi
 * @param {Object} abi Contract abi
 * @param {String} method Function name
 * @param {Array<T>} params Array of function params to be encoded
 * @return Encoded params data
 */
export const encodeParams = (abi, method, params) => {
  return new ethers.utils.Interface(abi).functions[method].encode([...params])
}

/**
 * Function to get encoded data to use in MultiSend library
 * @param {Number} operation
 * @param {String} to
 * @param {Number} value
 * @param {String} data
 */

// export const encodeDataForMultiSend = (operation, to, value, data) => {
//   const dataBuffer = Buffer.from(util.stripHexPrefix(data), 'hex')
//   const encoded = abi.solidityPack(
//     ['uint8', 'address', 'uint256', 'uint256', 'bytes'],
//     [operation, to, value, dataBuffer.length, dataBuffer]
//   )

//   return encoded.toString('hex')
// }

export const encodeDataForMultiSend = (operation, to, value, data) => {
  const transactionWrapper = new ethers.utils.Interface([
    'function send(uint8 operation, address to, uint256 value, bytes data)'
  ])
  return transactionWrapper.functions.send
    .encode([operation, to, value, data])
    .substr(10)
}

/**
 * Function to get specific param from transaction event
 * @param {Object} tx Transaction object compatible with ethers.js library
 * @param {String} eventName Event name to parse param from
 * @param {String} paramName Parameter to be retrieved from event log
 * @param {Object} contract Contract instance compatible with ethers.js library
 * @return {String} Parameter parsed from transaction event
 */
export const getParamFromTxEvent = async (
  tx,
  eventName,
  paramName,
  contract
) => {
  const provider = contract.provider
  const txReceipt = await provider.getTransactionReceipt(tx.hash)
  const topic = contract.interface.events[eventName].topic
  let logs = txReceipt.logs
  logs = logs.filter(
    l => l.address === contract.address && l.topics[0] === topic
  )
  const param = contract.interface.events[eventName].decode(logs[0].data)[
    paramName
  ]
  return param
}

export const buildCreate2Address = (creatorAddress, saltHex, byteCode) => {
  const byteCodeHash = ethers.utils.keccak256(byteCode)
  return `0x${ethers.utils
    .keccak256(
      `0x${['ff', creatorAddress, saltHex, byteCodeHash]
        .map(x => x.replace(/0x/, ''))
        .join('')}`
    )
    .slice(-40)}`.toLowerCase()
}

/**
 * @description Function to create link for ETH and/or ERC20
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Wei amount
 * @param {String} tokenAddress Token address
 * @param {Number} tokenAmount Amount of tokens
 * @param {Number} expirationTime Link expiration timestamp
 * @return {Object}
 */
export const createLink = async ({
  signingKeyOrWallet,
  linkdropModuleAddress,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime
}) => {
  const linkWallet = ethers.Wallet.createRandom()
  const linkKey = linkWallet.privateKey
  const linkId = linkWallet.address

  const linkdropSignerSignature = await signLink({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    linkId
  })

  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop signer
  }
}

/**
 * @description Function to sign link
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {Number} weiAmount Amount of wei
 * @param {String} tokenAddress Address of token contract
 * @param {Number} tokenAmount Amount of tokens
 * @param {Number} expirationTime Link expiration timestamp
 * @param {String} linkId Link id
 * @return {String} signature
 */
const signLink = async function ({
  signingKeyOrWallet,
  linkdropModuleAddress,
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  linkId
}) {
  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet)
  }

  const messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'address', 'uint', 'uint', 'address'],
    [
      linkdropModuleAddress,
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkId
    ]
  )
  const messageHashToSign = ethers.utils.arrayify(messageHash)
  return signingKeyOrWallet.signMessage(messageHashToSign)
}

/**
 * @description Function to create link for ETH and/or ERC721
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {String} weiAmount Wei amount
 * @param {String} nftAddress NFT address
 * @param {Number} tokenId Token id
 * @param {Number} expirationTime Link expiration timestamp
 * @return {Object}
 */
export const createLinkERC721 = async ({
  signingKeyOrWallet,
  linkdropModuleAddress,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime
}) => {
  const linkWallet = ethers.Wallet.createRandom()
  const linkKey = linkWallet.privateKey
  const linkId = linkWallet.address

  const linkdropSignerSignature = await signLinkERC721({
    signingKeyOrWallet,
    linkdropModuleAddress,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    linkId
  })

  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop signer
  }
}

/**
 * @description Function to sign link for ERC721
 * @param {String | Object} signingKeyOrWallet Signing key or wallet instance
 * @param {String} linkdropModuleAddress Address of linkdrop module
 * @param {Number} weiAmount Amount of wei
 * @param {String} nftAddresss Address of NFT
 * @param {Number} tokenId Token id
 * @param {Number} expirationTime Link expiration timestamp
 * @param {String} linkId Link id
 * @return {String} signature
 */
const signLinkERC721 = async function ({
  signingKeyOrWallet,
  linkdropModuleAddress,
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  linkId
}) {
  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet)
  }

  const messageHash = ethers.utils.solidityKeccak256(
    ['address', 'uint', 'address', 'uint', 'uint', 'address'],
    [
      linkdropModuleAddress,
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      linkId
    ]
  )
  const messageHashToSign = ethers.utils.arrayify(messageHash)
  return signingKeyOrWallet.signMessage(messageHashToSign)
}

/**
 * @description Function to sign receiver address
 * @param {String} linkKey Ephemeral key attached to link
 * @param {String} receiverAddress Receiver address
 */
export const signReceiverAddress = async (linkKey, receiverAddress) => {
  const wallet = new ethers.Wallet(linkKey)
  const messageHash = ethers.utils.solidityKeccak256(
    ['address'],
    [receiverAddress]
  )
  const messageHashToSign = ethers.utils.arrayify(messageHash)
  return wallet.signMessage(messageHashToSign)
}
