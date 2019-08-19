import { LinkdropSDK } from '@linkdrop/sdk/src/index'
export default ({ linkdropMasterAddress, chain, jsonRpcUrl, apiHost, factoryAddress }) => LinkdropSDK({
  linkdropMasterAddress,
  chain,
  jsonRpcUrl,
  apiHost,
  factoryAddress
})
