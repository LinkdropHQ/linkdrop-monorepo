import { put, call, all, select } from 'redux-saga/effects'
import { getItems, getAssetPrice } from 'data/api/assets'
import { ethers, utils } from 'ethers'
import TokenMock from 'contracts/TokenMock.json'
import { defineNetworkName } from '@linkdrop/commons'
import { getImages } from 'helpers'

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
    icon: `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address.toLowerCase()}/logo.png`,
    symbol,
    decimals,
    type: 'erc20',
    price: assetPrice
  }
}

const generator = function * () {
  try {
    const chainId = yield select(generator.selectors.chainId)
    const contractAddress = yield select(generator.selectors.contractAddress)
    const networkName = defineNetworkName({ chainId })
    const { status = 0, result = [], message } = yield call(getItems, { address: contractAddress, networkName })
    const provider = yield ethers.getDefaultProvider(networkName)
    const ethBalance = yield provider.getBalance(contractAddress)

    let assetsStorage = []
    if (status && status === '1' && message === 'OK') {
      const erc20Assets = result.filter(asset => asset.type === 'ERC-20')
      const erc20AssetsFormatted = yield all(erc20Assets.map(({ contractAddress: address, symbol, decimals }) => getTokenData({ address, symbol, decimals, chainId, provider, contractAddress })))
      assetsStorage = assetsStorage.concat(erc20AssetsFormatted)
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
        icon: getImages({ src: 'ether' }).image,
        price: assetPrice
      }])
    }
    yield put({ type: 'ASSETS.SET_ITEMS', payload: { items: assetsStorage || [] } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  contractAddress: ({ user: { contractAddress } }) => contractAddress,
  sdk: ({ user: { sdk } }) => sdk,
  chainId: ({ user: { chainId } }) => chainId
}
