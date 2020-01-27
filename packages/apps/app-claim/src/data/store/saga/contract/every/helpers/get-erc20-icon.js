import { ethers, utils } from 'ethers'
import { getImages } from 'helpers'

const generator = function * ({ payload }) {
  try {
    const ethWalletContract = ethers.constants.AddressZero
    const { token } = payload
    switch (token.toLowerCase()) {
      case ethWalletContract:
        return getImages({ src: 'ether' }).imageRetina
      case '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359':
        return getImages({ src: 'dai' }).imageRetina
      case '0xeb269732ab75a6fd61ea60b06fe994cd32a83549':
      default:
        return `https://trustwalletapp.com/images/tokens/${token.toLowerCase()}.png`
    }
  } catch (e) {
    console.error(e)
    return
  }
}

export default generator