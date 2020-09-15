const ethers = require('ethers')
const Wallet = require('ethereumjs-wallet')
// Turn off annoying warnings
ethers.errors.setLogLevel('error')

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

export const computeBytecode = masterCopyAddress => {
  const bytecode = `0x363d3d373d3d3d363d73${masterCopyAddress.slice(
    2
  )}5af43d82803e903d91602b57fd5bf3`
  return bytecode
}

export const computeProxyAddress = (
  factoryAddress,
  linkdropMasterAddress,
  campaignId
) => {
  if (factoryAddress == null || factoryAddress === '') {
    throw new Error('Please provide factory address')
  }

  if (linkdropMasterAddress == null || linkdropMasterAddress === '') {
    throw new Error('Please provide linkdrop master address')
  }

  if (campaignId == null || campaignId === '') {
    throw new Error('Please provide campaign id')
  }

  const salt = ethers.utils.solidityKeccak256(
    ['address', 'uint256'],
    [linkdropMasterAddress, campaignId]
  )

  const initcode = '0x6352c7420d6000526103ff60206004601c335afa6040516060f3'

  const proxyAddress = buildCreate2Address(factoryAddress, salt, initcode)
  return proxyAddress
}

// Generates new link for ETH and ERC20
export const createLink = async ({
  linkdropSigner, // Wallet
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  version,
  chainId,
  proxyAddress
}) => {
  const { address: linkId, privateKey: linkKey } = generateAccount()

  const linkdropSignerSignature = await signLink({
    linkdropSigner,
    weiAmount,
    tokenAddress,
    tokenAmount,
    expirationTime,
    version,
    chainId,
    linkId,
    proxyAddress
  })

  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop verifier
  }
}

// Should be signed by linkdropSigner (ETH, ERC20)
export const signLink = async ({
  linkdropSigner, // Wallet
  weiAmount,
  tokenAddress,
  tokenAmount,
  expirationTime,
  version,
  chainId,
  linkId,
  proxyAddress
}) => {
  const messageHash = ethers.utils.solidityKeccak256(
    ['uint', 'address', 'uint', 'uint', 'uint', 'uint', 'address', 'address'],
    [
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      version,
      chainId,
      linkId,
      proxyAddress
    ]
  )
  const messageHashToSign = ethers.utils.arrayify(messageHash)
  const signature = await linkdropSigner.signMessage(messageHashToSign)
  return signature
}

// Generates new link for ERC721
export const createLinkERC721 = async ({
  linkdropSigner, // Wallet
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  version,
  chainId,
  proxyAddress
}) => {
  const { address: linkId, privateKey: linkKey } = generateAccount()

  const linkdropSignerSignature = await signLinkERC721({
    linkdropSigner,
    weiAmount,
    nftAddress,
    tokenId,
    expirationTime,
    version,
    chainId,
    linkId,
    proxyAddress
  })
  return {
    linkKey, // link's ephemeral private key
    linkId, // address corresponding to link key
    linkdropSignerSignature // signed by linkdrop verifier
  }
}

// Should be signed by linkdropSigner (ERC721)
export const signLinkERC721 = async ({
  linkdropSigner, // Wallet
  weiAmount,
  nftAddress,
  tokenId,
  expirationTime,
  version,
  chainId,
  linkId,
  proxyAddress
}) => {
  const messageHash = ethers.utils.solidityKeccak256(
    ['uint', 'address', 'uint', 'uint', 'uint', 'uint', 'address', 'address'],
    [
      weiAmount,
      nftAddress,
      tokenId,
      expirationTime,
      version,
      chainId,
      linkId,
      proxyAddress
    ]
  )
  const messageHashToSign = ethers.utils.arrayify(messageHash)
  const signature = await linkdropSigner.signMessage(messageHashToSign)
  return signature
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

/**
 * Function to generate new account
 * @return {Object} `{address, privateKey}`
 */
export const generateAccount = () => {
  return ethers.Wallet.createRandom()
}
