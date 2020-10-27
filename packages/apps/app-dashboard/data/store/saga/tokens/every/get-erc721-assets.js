import { put, call, select, all } from 'redux-saga/effects'
import { getERC721Items, getERC721TokenData, getXdaiERC721Items } from 'data/api/tokens'
import { defineNetworkName, defineJsonRpcUrl } from '@linkdrop/commons'
import { ethers } from 'ethers'
import NFTMock from 'contracts/NFTMock.json'
import { infuraPk, jsonRpcUrlXdai } from 'app.config.js'

const getTokenIds = function * ({
  tokenAddress,
  provider,
  address,
  symbol,
  name
}) {
  console.log({
    tokenAddress,
    provider,
    address,
    symbol,
    name
  })
  const tokenContract = yield new ethers.Contract(tokenAddress, NFTMock.abi, provider)
  const numberOfTokens = yield tokenContract.balanceOf(address)
  console.log({ tokenContract })
  for (let i = 0; i < Number(numberOfTokens); i++) {
    const token = yield tokenContract.tokenOfOwnerByIndex(address, i)
    console.log({
      token
    })
    // sum.push(
    //   this.tokenContract
    //     .tokenOfOwnerByIndexPromise(owner, i)
    //     .then(t => t.toString())
    //     .then(async tokenId => {
    //       const metadata = await this.getMetadata(tokenId);
    //       return { tokenId, metadata };
    //     })
    // );
  }
  return {
    tokenId: '1',
    address: tokenAddress,
    symbol,
    name,
    image: ''
  }
  // const promises = [];
  // for (let i = 0; i < numberOfTokens; i++) {
  //   promises.push(
  //     this.tokenContract
  //       .tokenOfOwnerByIndexPromise(owner, i)
  //       .then(t => t.toString())
  //       .then(async tokenId => {
  //         const metadata = await this.getMetadata(tokenId);
  //         return { tokenId, metadata };
  //       })
  //   );
  // }
}

const getTokens = function * ({ actualJsonRpcUrl, provider, currentAddress, networkName, page }) {
  const { assets } = yield call(getERC721Items, { address: currentAddress, networkName, page })
  if (assets) {
    const assetsFormatted = yield all(assets.map(({ image_preview_url: imagePreview, token_id: tokenId, asset_contract: { address, symbol }, name }) => getTokenData({ imagePreview, provider, tokenId, address, name })))
    const assetsMerged = assetsFormatted.reduce((sum, { tokenId, address, symbol, name, image }) => {
      if (sum[address]) {
        sum[address] = { ...sum[address], names: { ...sum[address].names, [tokenId]: name }, ids: [...sum[address].ids, tokenId], images: { ...sum[address].images, [tokenId]: image } }
      } else {
        sum[address] = { address, symbol, names: { [tokenId]: name }, ids: [tokenId], images: { [tokenId]: image } }
      }
      return sum
    }, {})
    const finalAssets = Object.keys(assetsMerged).map(address => assetsMerged[address])
    
    yield put({ type: 'TOKENS.SET_ERC721_ASSETS', payload: { assetsERC721: finalAssets } })
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
  }
}

const getTokensXdai = function * ({ currentAddress, provider }) {
  const { result: assets } = yield call(getXdaiERC721Items, { address: currentAddress })
  if (assets) {
    const assetsFiltered = assets.filter(({ type }) => type === 'ERC-721')
    const assetsFormatted = yield all(assetsFiltered.map(({ contractAddress, name, symbol }) => call(getTokenIds, { tokenAddress: contractAddress, provider, address: currentAddress, symbol, name })))
    const assetsMerged = assetsFormatted.reduce((sum, { tokenId, address, symbol, name, image }) => {
      if (sum[address]) {
        sum[address] = { ...sum[address], names: { ...sum[address].names, [tokenId]: name }, ids: [...sum[address].ids, tokenId], images: { ...sum[address].images, [tokenId]: image } }
      } else {
        sum[address] = { address, symbol, names: { [tokenId]: name }, ids: [tokenId], images: { [tokenId]: image } }
      }
      return sum
    }, {})
    const finalAssets = Object.keys(assetsMerged).map(address => assetsMerged[address])
    
    yield put({ type: 'TOKENS.SET_ERC721_ASSETS', payload: { assetsERC721: finalAssets } })
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
  }
}
 
const defineSymbol = function * ({ tokenContract, address }) {
  try {
    const symbol = yield tokenContract.symbol()
    return symbol
  } catch (e) {
    return `NFT-${address.slice(0, 3)}`
  }
}

const getTokenData = function * ({ tokenId, address, name, provider, imagePreview }) {
  const tokenContract = yield new ethers.Contract(address, NFTMock.abi, provider)
  const symbol = yield defineSymbol({ tokenContract, address })
  let metadataURL = ''
  let image = address.toLowerCase() === '0xc94edae65cd0e07c17e7e1b6afb46589297313ae' ? imagePreview : ''
  try {
    if (image.length === 0) {
      if (tokenContract.tokenURI) {
        metadataURL = yield tokenContract.tokenURI(tokenId)
      }
      if (metadataURL !== '') {
        const data = yield call(getERC721TokenData, { erc721URL: metadataURL })
        if (data) {
          image = data.image
        }
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
    const { page } = payload
    const currentAddress = '0xA582360DA4ae1fBb912C975fcce1A0C0e2af91e8'

    const chainId = yield select(generator.selectors.chainId)
    const networkName = defineNetworkName({ chainId })
    const actualJsonRpcUrl = defineJsonRpcUrl({ chainId, infuraPk, jsonRpcUrlXdai })
    console.log({ actualJsonRpcUrl })
    const provider = yield new ethers.providers.JsonRpcProvider(actualJsonRpcUrl)
    console.log({ provider })
    if (networkName === 'xdai') {
      yield getTokensXdai({ currentAddress, provider })
    } else {
      yield getTokens({ actualJsonRpcUrl, provider, currentAddress, networkName, page })
    }
    
  } catch (e) {
    console.error(e)
    yield put({ type: 'TOKENS.SET_LOADING', payload: { loading: false } })
  }
}

export default generator
generator.selectors = {
  chainId: ({ user: { chainId } }) => chainId,
  web3Provider: ({ user: { web3Provider } }) => web3Provider
}
