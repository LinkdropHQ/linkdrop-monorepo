import { ethers, utils } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    const { contract, token } = payload
    switch (token.toLowerCase()) {
      case ethWalletContract:
      case '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359':
      case '0xeb269732ab75a6fd61ea60b06fe994cd32a83549':
        return 18
      default:
        return yield contract.decimals()
    }
  } catch (e) {
    console.error(e)
    return 0
  }
}

export default generator