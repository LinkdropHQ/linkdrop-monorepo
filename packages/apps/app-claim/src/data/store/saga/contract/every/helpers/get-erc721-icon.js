import { ethers } from 'ethers'
import { call } from 'redux-saga/effects'
import { getERC721TokenData } from 'data/api/tokens'

const getImage = function * ({ metadataURL }) {
  try {
    const { image } = yield call(getERC721TokenData, { erc721URL: metadataURL })
    return image
  } catch (err) {
    console.error(err)
    return ''
  }
}

const generator = function * ({ payload }) {
  try {
    const { contract, tokenId, nft } = payload
    const zeroAddress = ethers.constants.AddressZero
    switch (nft.toLowerCase()) {
      case zeroAddress:
        return ''
      default: {
        const metadataURL = yield contract.tokenURI(tokenId)
        if (metadataURL === '') { return '' }
        return yield getImage({ metadataURL })
      }
    }
  } catch (e) {
    console.error(e)
    return
  }
}

export default generator