import { put, select, call } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { defineNetworkName } from '@linkdrop/commons'
import TokenMock from 'contracts/TokenMock.json'
import { getAssetPrice } from 'data/api/assets'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { tokenAmount, tokenAddress, chainId } = payload
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    let decimals
    let symbol
    let icon
    console.log({ tokenAmount, tokenAddress, chainId })
    if (tokenAddress.toLowerCase() === '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359') {
      // DAI token has problem with fetching decimals
      decimals = 18
      symbol = 'DAI'
      icon = `https://trustwalletapp.com/images/tokens/${tokenAddress.toLowerCase()}.png`
    } else {
      const contract = yield new ethers.Contract(tokenAddress, TokenMock.abi, provider)
      decimals = yield contract.decimals()
      symbol = yield contract.symbol()
      icon = `https://trustwalletapp.com/images/tokens/${tokenAddress.toLowerCase()}.png`
    }
    let assetPrice = 0
    if (Number(chainId) === 1) {
      assetPrice = yield call(getAssetPrice, { symbol })
    }
    const amountBigNumber = utils.formatUnits(tokenAmount, decimals)
    const assetsToClaim = yield select(generator.selectors.itemsToClaim)
    const newAssetToClaim = {
      balanceFormatted: Number(amountBigNumber),
      balance: tokenAmount,
      tokenAddress,
      icon,
      symbol,
      decimals,
      type: 'erc20',
      price: assetPrice
    }
    const assetsUpdated = assetsToClaim.concat([newAssetToClaim])
    yield put({ type: 'ASSETS.SET_ITEMS_TO_CLAIM', payload: { itemsToClaim: assetsUpdated } })
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    yield put({ type: 'USER.SET_ERRORS', payload: { errors: ['LINK_INVALID'] } })
    console.error(e)
  }
}

export default generator
generator.selectors = {
  itemsToClaim: ({ assets: { itemsToClaim } }) => itemsToClaim
}
