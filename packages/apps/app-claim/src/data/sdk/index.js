import LinkdropSDK from '@linkdrop/sdk/src/index'

export default ({ senderAddress, chain, jsonRpcUrl, apiHost, factoryAddress }) => new LinkdropSDK({
  senderAddress,
  factoryAddress,
  chain,
  jsonRpcUrl,
  apiHost
})
