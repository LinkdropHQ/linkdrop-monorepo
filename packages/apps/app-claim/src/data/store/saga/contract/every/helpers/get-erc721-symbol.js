import { ethers } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const { contract, nft } = payload
    const zeroAddress = ethers.constants.AddressZero
    switch (nft.toLowerCase()) {
      case zeroAddress:
        return
      default:
        return yield contract.symbol()
    }
  } catch (e) {
    console.error(e)
    return
  }
}

export default generator