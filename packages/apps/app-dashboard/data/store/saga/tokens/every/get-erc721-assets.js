import { put, call, select, all } from 'redux-saga/effects'
import { getERC721Items, getERC721TokenData } from 'data/api/tokens'
import { defineNetworkName } from '@linkdrop/commons'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'

const getTokenData = function * ({ tokenId, address, name, provider }) {
  const tokenContract = yield new ethers.Contract(address, NFTMock.abi, provider)
  const symbol = yield tokenContract.symbol()
  const metadataURL = yield tokenContract.tokenURI(tokenId)
  let image
  if (metadataURL !== '') {
    const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
    if (data) {
      image = data.image
    }
  }
  return {
    tokenId,
    address,
    symbol,
    name,
    image
  }
}

const generator = function * ({ payload }) {
  try {
    const { currentAddress } = payload
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const { assets } = yield call(getERC721Items, { address: currentAddress, networkName })
    if (assets) {
      const networkName = defineNetworkName({ chainId })
      const provider = yield ethers.getDefaultProvider(networkName)
      const assetsFormatted = yield all(assets.map(({ token_id: tokenId, asset_contract: { address, symbol }, name }) => getTokenData({ provider, tokenId, address, name })))
      const assetsMerged = assetsFormatted.reduce((sum, { tokenId, address, symbol, name, image }) => {
        if (sum[address]) {
          sum[address] = { ...sum[address], ids: [...sum[address].ids, tokenId] }
        } else {
          sum[address] = { address, symbol, image, name, ids: [tokenId] }
        }
        return sum
      }, {})
      const finalAssets = Object.keys(assetsMerged).map(address => assetsMerged[address])
      yield put({ type: 'TOKENS.SET_ERC721_ASSETS', payload: { assetsERC721: finalAssets } })
    }
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}
