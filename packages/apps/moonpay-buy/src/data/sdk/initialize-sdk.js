import LinkdropSDK from '@linkdrop/sdk/src/index'

export default ({ senderAddress, factoryAddress, apiHost }) => new LinkdropSDK({
  senderAddress,
  factoryAddress,
  apiHost
})
