import { ethers, utils } from 'ethers'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'
import { defineJsonRpcUrl } from '@linkdrop/commons'
import TokenMock from 'contracts/TokenMock.json'

const generator = function * ({ payload }) {
  try {
    const { account, decimals, contract } = payload
    const tokenBalance = yield contract.balanceOf(account)
    const tokenBalanceFormatted = utils.formatUnits(
      String(tokenBalance),
      decimals
    )
    return {
      tokenBalance,
      tokenBalanceFormatted
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
