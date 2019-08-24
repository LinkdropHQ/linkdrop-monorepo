import reducers from './reducers'

const initialState = {
  itemsToClaim: [],
  items: [
    {
      balanceFormatted: 25,
      balance: {
        _hex: '0x015af1d78b58c40000'
      },
      tokenAddress: '0xa3b5fdeb5dbc592ffc5e222223376464b9c56fb8',
      icon: 'https://trustwalletapp.com/images/tokens/0xa3b5fdeb5dbc592ffc5e222223376464b9c56fb8.png',
      symbol: 'FDGT',
      decimals: 18,
      type: 'erc20',
      price: 0
    },
    {
      balanceFormatted: 0.0075,
      balance: {
        _hex: '0x1aa535d3d0c000'
      },
      tokenAddress: '0x0000000000000000000000000000000000000000',
      symbol: 'ETH',
      decimals: 18,
      type: 'erc20',
      price: 188.58
    }
  ],
  loading: false
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'ASSETS.SET_LOADING': reducers.setLoading,
  'ASSETS.SET_ITEMS_TO_CLAIM': reducers.setItemsToClaim,
  'ASSETS.SET_ITEMS': reducers.setItems
}
