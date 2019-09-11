// registrar.register(_hashLabel, address(this));
// ens.setResolver(_node, address(resolver));
// resolver.setAddr(_node, address(this));
// ReverseRegistrar reverseRegistrar = ReverseRegistrar(ens.owner(ADDR_REVERSE_NODE));
// reverseRegistrar.setName(_name);

import { ethers } from 'ethers'
import { ENS, ReverseRegistrar, FIFSRegistrar } from '@ensdomains/ens'

// const ADDR_REVERSE_NODE =
//   '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2'
// const registrar = ''
// const registry = '' // ENS
// const resolver = ''

const ensAddr = '0xe7410170f87102df0055eb195163a03b7f2bff4a' // rinkeby
// const ensAddr = '0x112234455c3a32fd11230c42e7bccd4a84e02010' // ropsten
// const ensAddr = '0x314159265dd8dbb310642f98f50c066173c1259b' // mainnet

const provider = new ethers.providers.JsonRpcProvider(
  'https://rinkeby.infura.io'
)
const wallet = new ethers.Wallet('', provider)

const main = async () => {
  const ensContract = new ethers.Contract(ensAddr, ENS.abi, wallet)

  const node = ethers.utils.namehash('linkdrop.test')

  const registrarAddr = await ensContract.owner(node)
  console.log('registrarAddr: ', registrarAddr)

  const registrarContract = new ethers.Contract(
    registrarAddr,
    FIFSRegistrar.abi,
    wallet
  )
  console.log('node: ', node)
  const hex = ethers.utils.toUtf8Bytes('amir')
  const label = ethers.utils.keccak256(hex)
  console.log('label: ', label)
  const tx = await registrarContract.register(
    label,
    '0xA208969D8F9E443E2B497540d069a5d1a6878f4E',
    { gasPrice: ethers.utils.parseUnits('20', 'gwei') }
  )
  console.log('tx: ', tx.hash)
}

main()
