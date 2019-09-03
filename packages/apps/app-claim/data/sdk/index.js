import LinkdropSDK from '@linkdrop/sdk/src/index'
export default ({ linkdropMasterAddress, chain, jsonRpcUrl, apiHost, factoryAddress }) => new LinkdropSDK({
  linkdropMasterAddress,
  chain,
  jsonRpcUrl,
  apiHost,
  factoryAddress
})
