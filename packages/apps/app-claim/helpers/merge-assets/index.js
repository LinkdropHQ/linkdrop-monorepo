import { add } from 'mathjs'
import { utils } from 'ethers'

export default (arr) => {
  return arr.reduce((res, { tokenAddress: newId, balanceFormatted }) => {
    var previouslyAdded = res.find(({ tokenAddress: prevId }) => prevId === newId)
    if (!previouslyAdded) {
      return res.concat({ tokenAddress: newId, balanceFormatted })
    } else {
      return res.map(item => {
        if (item.tokenAddress === previouslyAdded.tokenAddress) {
          const commonBalanceFormatted = add(Number(balanceFormatted), Number(previouslyAdded.balanceFormatted))
          const balance = utils.parseUnits(
            String(commonBalanceFormatted),
            item.decimals
          )
          return { ...item, balance, balanceFormatted: commonBalanceFormatted }
        } else {
          return item
        }
      })
    }
  }, [])
}
