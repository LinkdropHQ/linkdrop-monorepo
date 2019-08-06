import { WalletSDK } from '@linkdrop/sdk'
import { ethers } from 'ethers'
import { claim } from './claim_eth'
const walletSDK = new WalletSDK()

async function main () {
  //
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rinkeby.infura.io'
  )
  const privateKey =
    '495AAFF3574670DA641373E119332DE00AE13E211F918CBD5D63D7C30F4F741A'
  const funder = new ethers.Wallet(privateKey, provider)

  const mnemonic = ethers.Wallet.createRandom().mnemonic
  // const mnemonic = 'tired error before token warfare lens news fault visa trip chaos inform'
  console.log('mnemonic: ', mnemonic)

  //   const first = ethers.Wallet.fromMnemonic(mnemonic)
  //   console.log('first: ', first.address)
  //   const second = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/1")
  //   console.log('second: ', second.address)
  //   const third = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/2")
  //   console.log('third: ', third.address)

  const owners = []

  for (let i = 0; i < 3; i++) {
    const addr = ethers.Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/${i}`)
      .address
    console.log('addr: ', addr)
    owners.push(addr)
  }
  const threshold = 1
  const saltNonce = 1234

  const safeAddress = await walletSDK.getAddress({
    owners,
    threshold,
    saltNonce
  })
  console.log('Safe address: ', safeAddress)

  //   const rawTx = { to: safeAddress, value: ethers.utils.parseEther('0.01') }
  //   const tx = await funder.sendTransaction(rawTx)
  //   tx.wait(1)

  await claim(safeAddress)

  // await deploySafe(safeAddress)
}

main()
