import LinkdropSDK from '@linkdrop/sdk/src/index'

export default ({ senderAddress, factoryAddress, apiHost, claimHost }) => new LinkdropSDK({
  senderAddress,
  factoryAddress,
  apiHost,
  chain: 'ropsten',
  claimHost
})
