import { put, call, all, select } from 'redux-saga/effects'
import { getItems, getAssetPrice } from 'data/api/assets'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import { defineNetworkName } from '@linkdrop/commons'

const getTokenData = function * ({ address, symbol, decimals, chainId, provider, contractAddress }) {
  let assetPrice = 0
  if (Number(chainId) === 1) {
    assetPrice = yield call(getAssetPrice, { symbol })
  }

  const tokenContract = new ethers.Contract(address, TokenMock.abi, provider)

  const balance = yield tokenContract.balanceOf(contractAddress)
  // currentAddress - кошелек пользователя
  // account
  const amountFormatted = yield utils.formatUnits(balance, decimals)
  // const assetsToClaim = select(generator.selectors.itemsToClaim)
  return {
    balanceFormatted: Number(amountFormatted),
    balance,
    tokenAddress: address,
    icon: `https://trustwalletapp.com/images/tokens/${address.toLowerCase()}.png`,
    symbol,
    decimals,
    type: 'erc20',
    price: assetPrice
  }
}

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'USER.SET_LOADING', payload: { loading: true } })
    const { chainId = '1' } = payload
    const contractAddress = yield select(generator.selectors.contractAddress)
    if (chainId === '4') {
      yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: assetsMock } })
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }
    const { total = 0, docs = [] } = yield call(getItems, { wallet: contractAddress })
    const networkName = defineNetworkName({ chainId })
    const provider = yield ethers.getDefaultProvider(networkName)
    const ethBalance = yield provider.getBalance(contractAddress)
    let assetsStorage = []
    if ((total && total > 0)) {
      const assets = yield all(docs.map(({ contract: { address, symbol, decimals } }) => getTokenData({ address, symbol, decimals, chainId, provider, contractAddress })))
      console.log({ assets })
      assetsStorage = assetsStorage.concat(assets)
    }

    if (ethBalance && ethBalance > 0) {
      let assetPrice = 0
      if (Number(chainId) === 1) {
        assetPrice = yield call(getAssetPrice, { symbol: 'ETH' })
      }
      const amountFormatted = utils.formatUnits(ethBalance, 18)
      assetsStorage = assetsStorage.concat([{
        balanceFormatted: Number(amountFormatted),
        balance: ethBalance,
        tokenAddress: ethers.constants.AddressZero,
        symbol: 'ETH',
        decimals: 18,
        type: 'erc20',
        price: assetPrice
      }])
    }
    yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: assetsStorage || [] } })
    yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  contractAddress: ({ user: { contractAddress } }) => contractAddress,
  sdk: ({ user: { sdk } }) => sdk
}

const assetsMock = []
