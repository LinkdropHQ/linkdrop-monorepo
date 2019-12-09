import LinkdropSDK from '@linkdrop/sdk/src/index'

export default ({ jsonRpcUrl, chain = 'ropsten', senderAddress, factoryAddress, apiHost, claimHost }) => new LinkdropSDK({
  senderAddress,
  factoryAddress,
  apiHost,
  chain,
  jsonRpcUrl,
  claimHost
})

