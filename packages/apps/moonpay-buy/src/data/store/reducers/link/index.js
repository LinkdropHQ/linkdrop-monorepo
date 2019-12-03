import reducers from './reducers'

const initialState = {
  loading: false,
  // link: null,
  link: 'http://localhost:9002/#/receive?token=0x0000000000000000000000000000000000000000&nft=0x0000000000000000000000000000000000000000&feeToken=0x0000000000000000000000000000000000000000&feeReceiver=0x0000000000000000000000000000000000000000&linkKey=0x4325a3b72d7e48f8c7cc72faf217447fcf583853d3d43e8bf14a94ca0a677105&nativeTokensAmount=147130000000000000&tokensAmount=0&tokenId=0&feeAmount=0&expiration=11111111111&signerSignature=0xc44525e91a6de08f7f9a6c2273611260ccb164cfdb073c40090522525282bb1978fa1731cba24b6ad9de01eea3783071b1614802b542daa91186fecae699d5f71b&linkdropContract=0xeb8996b2565c8981d9ad0e7b2122d87db1d85bb0&sender=0xb7Aa694c4C42dC78cDD3559efbC7477fE983aace&chainId=3',
  // page: 'process'
  page: 'finished'
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'LINK.SET_LOADING': reducers.setLoading,
  'LINK.SET_LINK': reducers.setLink,
  'LINK.SET_PAGE': reducers.setPage
}
