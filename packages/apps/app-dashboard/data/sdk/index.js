import LinkdropSDK from '@linkdrop/sdk/src/index'
export default ({ claimHost, linkdropMasterAddress, chainId, jsonRpcUrl, apiHost, factoryAddress }) => LinkdropSDK({
  linkdropMasterAddress,
  chain: chainId,
  claimHost,
  jsonRpcUrl,
  apiHost,
  factoryAddress
})
