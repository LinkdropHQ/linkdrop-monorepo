import { ethers } from 'ethers'

import { ENS, ReverseRegistrar } from '@ensdomains/ens'

// const ensAddr = '0xe7410170f87102df0055eb195163a03b7f2bff4a'
const ensAddr = '0x112234455c3a32fd11230c42e7bccd4a84e02010' // ropsten

const provider = new ethers.providers.JsonRpcProvider(
  'https://ropsten.infura.io'
)

const ensContract = new ethers.Contract(ensAddr, ENS.abi, provider)

const main = async () => {
  const nameHash = ethers.utils.namehash('mikhail.my-login.test')
  console.log('nameHash: ', nameHash)
  const owner = await ensContract.owner(nameHash)
  console.log('owner: ', owner)
  const resolver = await ensContract.resolver(nameHash)
  console.log('resolver: ', resolver)
  const reverseResolver = await ensContract.resolver(
    ethers.utils.namehash(`${owner.slice(2)}.addr.reverse`)
  )
  console.log('reverseResolver: ', reverseResolver)

  const reverseNode =
    '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2'
  const reverseRegistrarAddr = await ensContract.owner(reverseNode)
  console.log('reverseRegistrarAddr: ', reverseRegistrarAddr)

  const reverseRegistrarContract = new ethers.Contract(
    reverseRegistrarAddr,
    ReverseRegistrar.abi,
    provider
  )

  const def = await reverseRegistrarContract.defaultResolver()
  console.log('def: ', def)
}

main()
