import { WalletSDK } from '@linkdrop/sdk/src/index'
export default ({ chain, infuraPk }) => new WalletSDK(chain, infuraPk)
