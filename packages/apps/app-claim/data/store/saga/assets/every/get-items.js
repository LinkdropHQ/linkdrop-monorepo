import { put, call, all, select } from 'redux-saga/effects'
import { getItems, getAssetPrice } from 'data/api/assets'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import { defineNetworkName } from '@linkdrop/commons'

const getTokenData = function * ({ address, symbol, decimals, chainId, provider, contractAddress, wallet }) {
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
    const { wallet, chainId = '1' } = payload
    if (chainId === '4') {
      yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: assetsMock } })
      return yield put({ type: 'USER.SET_LOADING', payload: { loading: false } })
    }

    const { total, docs } = yield call(getItems, { wallet })
    const networkName = defineNetworkName({ chainId })
    const contractAddress = yield select(generator.selectors.contractAddress)
    const provider = yield ethers.getDefaultProvider(networkName)
    if (total && total > 0) {
      const assets = yield all(docs.map(({ contract: { address, symbol, decimals } }) => getTokenData({ address, symbol, decimals, chainId, provider, contractAddress, wallet })))
      console.log({ assets })
      yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: assets } })
    }
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

const assetsMock = [
  {
    balanceFormatted: 0,
    balance: {
      _hex: '0x00'
    },
    tokenAddress: '0xade1b7955252c379dc4399d5cd609a9cac1686e5',
    icon: 'https://trustwalletapp.com/images/tokens/0xade1b7955252c379dc4399d5cd609a9cac1686e5.png',
    symbol: 'TGN',
    decimals: 8,
    type: 'erc20',
    price: 0
  },
  {
    balanceFormatted: 0,
    balance: {
      _hex: '0x00'
    },
    tokenAddress: '0x2c33f5fde437ad4c1de85d5d5cb864921ab583af',
    icon: 'https://trustwalletapp.com/images/tokens/0x2c33f5fde437ad4c1de85d5d5cb864921ab583af.png',
    symbol: 'Shell',
    decimals: 18,
    type: 'erc20',
    price: 0
  },
  {
    balanceFormatted: 0,
    balance: {
      _hex: '0x00'
    },
    tokenAddress: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    icon: 'https://trustwalletapp.com/images/tokens/0xb8c77482e45f1f44de1745f52c74426c631bdd52.png',
    symbol: 'BNB',
    decimals: 18,
    type: 'erc20',
    price: 0
  }
]
