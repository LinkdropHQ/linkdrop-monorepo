import { ethers, utils } from 'ethers'
import { AddressZero } from 'ethers/constants'

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

const buildCreate2Address = (creatorAddress, saltHex, byteCode) => {
  const byteCodeHash = utils.keccak256(byteCode)
  return `0x${utils
    .keccak256(
      `0x${['ff', creatorAddress, saltHex, byteCodeHash]
        .map(x => x.replace(/0x/, ''))
        .join('')}`
    )
    .slice(-40)}`.toLowerCase()
}

export const computeBytecode = masterCopyAddress => {
  const bytecode = `0x363d3d373d3d3d363d73${masterCopyAddress.slice(
    2
  )}5af43d82803e903d91602b57fd5bf3`
  return bytecode
}

// const initcode = '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'
// const initcodeTransfer = '0x6319ed26266000526103ff60206004601c335afa6040516060f3'

export const computeProxyAddress = (
  factoryAddress,
  senderAddress,
  campaignId
) => {
  const salt = utils.solidityKeccak256(
    ['address', 'uint256'],
    [senderAddress, campaignId]
  )
  // const bytecode = computePendingRuntimeCode(masterCopyAddress)

  const initcode =
    String(campaignId) === '0'
      ? '0x6319ed26266000526103ff60206004601c335afa6040516060f3'
      : '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'

  const proxyAddress = buildCreate2Address(factoryAddress, salt, initcode)
  return proxyAddress
}

export const signLink = async ({
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
  data,
  version,
  chainId,
  linkdropContract,
  signingKeyOrWallet
}) => {
  if (typeof signingKeyOrWallet === 'string') {
    signingKeyOrWallet = new ethers.Wallet(signingKeyOrWallet)
  }

  const linkParamsHash = ethers.utils.solidityKeccak256(
    [
      'address', // token
      'address', // nft
      'address', // feeToken
      'address', // feeReceiver
      'address', // linkId
      'uint', // nativeTokensAmount
      'uint', // tokensAmount
      'uint', // tokenId
      'uint', // feeAmount
      'uint', // expiration
      'bytes' // data
    ],
    [
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
    ]
  )

  const messageHash = ethers.utils.solidityKeccak256(
    [
      'bytes32', // linkParamsHash
      'uint', // version
      'uint', // chainId
      'address' // linkdropContract
    ],
    [linkParamsHash, version, chainId, linkdropContract]
  )

  const messageHashToSign = ethers.utils.arrayify(messageHash)
  const signature = await signingKeyOrWallet.signMessage(messageHashToSign)

  return signature
}

// Generates new link
export const createLink = async ({
  token = AddressZero,
  nft = AddressZero,
  feeToken = AddressZero,
  feeReceiver = AddressZero,
  nativeTokensAmount = 0,
  tokensAmount = 0,
  tokenId = 0,
  feeAmount = 0,
  expiration,
  data = '0x',
  version,
  chainId,
  linkdropContract,
  signingKeyOrWallet
}) => {
  const linkWallet = ethers.Wallet.createRandom()
  const linkKey = linkWallet.privateKey
  const linkId = linkWallet.address
  const signerSignature = await signLink({
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
    data,
    version,
    chainId,
    linkdropContract,
    signingKeyOrWallet
  })

  const linkParams = new LinkParams({
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
  })

  return {
    linkKey,
    linkId,
    signerSignature,
    linkParams
  }
}

export const signReceiverAddress = async (linkKey, receiverAddress) => {
  const wallet = new ethers.Wallet(linkKey)
  const messageHash = ethers.utils.solidityKeccak256(
    ['address'],
    [receiverAddress]
  )
  const messageHashToSign = ethers.utils.arrayify(messageHash)
  const signature = await wallet.signMessage(messageHashToSign)
  return signature
}

export const encodeParams = (abi, method, params) => {
  return new ethers.utils.Interface(abi).functions[method].encode([...params])
}

export const encodeCallbackTransaction = (to, value, data) => {
  const transactionWrapper = new ethers.utils.Interface([
    'function execute(address to, uint256 value, bytes data)'
  ])
  return transactionWrapper.functions.execute
    .encode([to, value, data])
    .substr(10)
}
