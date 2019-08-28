import { WalletSDK } from '@linkdrop/sdk/src/index'
export default ({ chain, infuraPk, factoryAddress }) => new WalletSDK(chain, infuraPk)
