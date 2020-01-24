import { utils } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const { amount, decimals } = payload
    console.log(utils.formatUnits(amount, decimals))
    return utils.formatUnits(amount, decimals)
  } catch (e) {
    console.error(e)
    return
  }
}

export default generator