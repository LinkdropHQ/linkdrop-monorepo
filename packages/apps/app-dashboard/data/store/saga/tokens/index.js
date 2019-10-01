import { takeEvery } from 'redux-saga/effects'

import getAssets from './every/get-assets'
import getERC721Assets from './every/get-erc721-assets'
import getEthData from './every/get-eth-data'
import getEthBalance from './every/get-eth-balance'

import getErc20Data from './every/get-erc20-data'
import getErc721Data from './every/get-erc721-data'

import getErc20Balance from './every/get-erc20-balance'
import getErc721Approved from './every/get-erc721-approved'
import setErc20Data from './every/set-erc20-data'
import setErc721Data from './every/set-erc721-data'
import emptyErc20Data from './every/empty-erc20-data'

import generateErc20Link from './every/generate-erc20-link'
import generateEthLink from './every/generate-eth-link'
import generateErc721Link from './every/generate-erc721-link'

export default function * () {
  yield takeEvery('*TOKENS.GET_ASSETS', getAssets)
  yield takeEvery('*TOKENS.GET_ERC721_ASSETS', getERC721Assets)
  yield takeEvery('*TOKENS.GET_ETH_DATA', getEthData)
  yield takeEvery('*TOKENS.GET_ETH_BALANCE', getEthBalance)
  yield takeEvery('*TOKENS.GET_ERC20_BALANCE', getErc20Balance)
  yield takeEvery('*TOKENS.GET_ERC721_APPROVED', getErc721Approved)
  yield takeEvery('*TOKENS.SET_ERC20_DATA', setErc20Data)
  yield takeEvery('*TOKENS.SET_ERC721_DATA', setErc721Data)
  yield takeEvery('*TOKENS.EMPTY_ERC20_DATA', emptyErc20Data)
  yield takeEvery('*TOKENS.GET_ERC20_DATA', getErc20Data)
  yield takeEvery('*TOKENS.GET_ERC721_DATA', getErc721Data)
  yield takeEvery('*TOKENS.GENERATE_ERC721_LINK', generateErc721Link)
  yield takeEvery('*TOKENS.GENERATE_ERC20_LINK', generateErc20Link)
  yield takeEvery('*TOKENS.GENERATE_ETH_LINK', generateEthLink)
}
