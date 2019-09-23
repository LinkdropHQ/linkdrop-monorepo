import { put, select, call } from 'redux-saga/effects'
import { ethers, utils } from 'ethers'
import { getImages } from 'helpers'
import { getAssetPrice } from 'data/api/assets'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: true } })
    const { weiAmount } = payload
    const chainId = yield select(generator.selectors.chainId)
    const decimals = 18
    const symbol = 'ETH'
    const amountBigNumber = utils.formatUnits(weiAmount, decimals)
    const assetsToClaim = yield select(generator.selectors.itemsToClaim)
    let assetPrice = 0
    if (Number(chainId) === 1) {
      assetPrice = yield call(getAssetPrice, { symbol })
    }
    const newAssetToClaim = {
      balanceFormatted: amountBigNumber,
      balance: weiAmount,
      tokenAddress: ethers.constants.AddressZero,
      icon: getImages({ src: 'ether' }).imageRetina,
      symbol,
      decimals,
      type: 'eth',
      price: assetPrice
    }
    const assetsUpdated = assetsToClaim.concat([newAssetToClaim])
    yield put({ type: 'ASSETS.SET_ITEMS_TO_CLAIM', payload: { itemsToClaim: assetsUpdated } })
    yield put({ type: 'ASSETS.SET_LOADING', payload: { loading: false } })
    yield put({ type: 'USER.SET_STEP', payload: { step: 1 } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  itemsToClaim: ({ assets: { itemsToClaim } }) => itemsToClaim,
  chainId: ({ user: { chainId } }) => chainId
}
