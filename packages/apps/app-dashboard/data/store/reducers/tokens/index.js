import reducers from './reducers'

const initialState = {
  assets: [],
  assetsERC721: [],
  symbol: null,
  decimals: null,
  loading: false,
  tokenType: null,
  address: null,
  ethBalanceFormatted: null,
  erc20Balance: null,
  ethBalance: null,
  erc20BalanceFormatted: null,
  erc721IsApproved: null,
  currentEthBalance: null,
  currentTokenBalance: null
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
  'TOKENS.SET_ERC20_BALANCE': reducers.setERC20Balance,
  'TOKENS.SET_ERC721_IS_APPROVED': reducers.setERC721IsApproved,
  'TOKENS.SET_LOADING': reducers.setLoading,
  'TOKENS.SET_CURRENT_ETH_BALANCE': reducers.setCurrentEthBalance,
  'TOKENS.SET_CURRENT_TOKEN_BALANCE': reducers.setCurrentTokenBalance
}
