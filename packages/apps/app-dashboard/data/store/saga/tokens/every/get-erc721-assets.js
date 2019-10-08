import { put, call, select, all } from 'redux-saga/effects'
import { getERC721Items, getERC721TokenData } from 'data/api/tokens'
import { defineNetworkName, defineJsonRpcUrl } from '@linkdrop/commons'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'

const defineSymbol = function * ({ tokenContract, address }) {
  try {
    const symbol = yield tokenContract.symbol()
    return symbol
  } catch (e) {
    return `NFT-${address.slice(0, 3)}`
  }
}

const getTokenData = function * ({ tokenId, address, name, provider }) {
  const tokenContract = yield new ethers.Contract(address, NFTMock.abi, provider)
  const symbol = yield defineSymbol({ tokenContract, address })
  let metadataURL = ''
  let image = ''
  try {
    if (tokenContract.tokenURI) {
      metadataURL = yield tokenContract.tokenURI(tokenId)
    }
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
  } catch (e) {
    return {
      tokenId,
      address,
      symbol,
      name,
      image
    }
  }
}

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: true } })
    const { currentAddress } = payload
    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const { assets } = yield call(getERC721Items, { address: currentAddress, networkName })
    if (assets) {
      const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
      const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
      const assetsFormatted = yield all(assets.map(({ token_id: tokenId, asset_contract: { address, symbol }, name }) => getTokenData({ provider, tokenId, address, name })))
      const assetsMerged = assetsFormatted.reduce((sum, { tokenId, address, symbol, name, image }) => {
        if (sum[address]) {
          sum[address] = { ...sum[address], ids: [...sum[address].ids, tokenId], images: { ...sum[address].images, [tokenId]: image } }
        } else {
          sum[address] = { address, symbol, name, ids: [tokenId], images: { [tokenId]: image } }
        }
        return sum
      }, {})
      const finalAssets = Object.keys(assetsMerged).map(address => assetsMerged[address])
      yield put({ type: 'TOKENS.SET_ERC721_ASSETS', payload: { assetsERC721: finalAssets } })
      yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
    }
  } catch (e) {
    console.error(e)
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId
}
