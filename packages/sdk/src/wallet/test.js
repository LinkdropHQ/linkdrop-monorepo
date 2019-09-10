import WalletSDK from './WalletSDK'
import { ethers } from 'ethers'

const main = async () => {
  const sdk = new WalletSDK()
  //   const response = await sdk.createSafe(
  //     '0xa208969d8f9e443e2b497540d069a5d1a6878f4e'
  //   )
  //   console.log('response: ', response)

  const privateKey = ''
  const safe = '0x563df37ff1e6a70d6d0af364a9ca95c31ea61c94'
  const sig = sdk.signTx({
    safe,
    privateKey,
    to: '0x646F6381010bA304cA1f912d6E7BB9972b4b6f56',
    value: 1234
  })
  console.log('sig: ', sig)
}

main()
