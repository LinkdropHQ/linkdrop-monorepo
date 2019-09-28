import reducers from './reducers'

const initialState = {
  assets: [],
  assetsERC721: [],
  symbol: null,
  decimals: null,
  tokenType: null,
  address: null,
  ethBalanceFormatted: null,
  erc20Balance: null,
  ethBalance: null,
  erc20BalanceFormatted: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState
  return actionMethod(newState, action)
}

const ACTIONS = {
  'TOKENS.SET_ASSETS': reducers.setAssets,
  'TOKENS.SET_ERC721_ASSETS': reducers.setERC721Assets,
  'TOKENS.SET_TOKEN_SYMBOL': reducers.setTokenSymbol,
  'TOKENS.SET_TOKEN_ADDRESS': reducers.setTokenAddress,
  'TOKENS.SET_TOKEN_TYPE': reducers.setTokenType,
  'TOKENS.SET_TOKEN_DECIMALS': reducers.setTokenDecimals,
  'TOKENS.SET_ETH_BALANCE': reducers.setEthBalance,
  'TOKENS.SET_ERC20_BALANCE': reducers.setERC20Balance
}
