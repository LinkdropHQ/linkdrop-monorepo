import { ethers, utils } from 'ethers'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'

const generator = function * ({ payload }) {
  try {
    const { account, chainId } = payload
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    const ethBalance = yield provider.getBalance(account)
    const ethBalanceFormatted = utils.formatEther(ethBalance)
    return {
      ethBalance,
      ethBalanceFormatted
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
