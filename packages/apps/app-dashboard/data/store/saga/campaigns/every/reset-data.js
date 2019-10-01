import { put } from 'redux-saga/effects'

const generator = function * ({ payload }) {
  try {
    yield put({ type: 'CAMPAIGNS.SET_TOKEN_AMOUNT', payload: { tokenAmount: null } })
    yield put({ type: 'CAMPAIGNS.SET_TOKEN_SYMBOL', payload: { tokenSymbol: null } })
    yield put({ type: 'TOKENS.SET_TOKEN_ADDRESS', payload: { address: null } })
    yield put({ type: 'TOKENS.SET_TOKEN_DECIMALS', payload: { address: null } })
    yield put({ type: 'CAMPAIGNS.SET_TOKEN_TYPE', payload: { tokenType: null } })
    yield put({ type: 'CAMPAIGNS.SET_DATE', payload: { date: null } })
    yield put({ type: 'CAMPAIGNS.SET_LINKS', payload: { links: [] } })
    yield put({ type: 'CAMPAIGNS.SET_ETH_AMOUNT', payload: { ethAmount: null } })
    yield put({ type: 'CAMPAIGNS.SET_LINKS_AMOUNT', payload: { linksAmount: null } })
    yield put({ type: 'CAMPAIGNS.SET_ID', payload: { id: null } })
    yield put({ type: 'CAMPAIGNS.SET_PROXY_ADDRESS', payload: { proxyAddress: null } })
    yield put({ type: 'TOKENS.SET_ERC20_BALANCE', payload: { erc20BalanceFormatted: null, erc20Balance: null } })
    yield put({ type: 'TOKENS.SET_ETH_BALANCE', payload: { ethBalanceFormatted: null, ethBalance: null } })
    yield put({ type: 'TOKENS.SET_ERC721_IS_APPROVED', payload: { erc721IsApproved: null } })
  } catch (e) {
    console.error(e)
  }
}

export default generator
