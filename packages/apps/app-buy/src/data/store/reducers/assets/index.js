import reducers from './reducers'
const ls = window.localStorage
const ethBalance = ls && ls.getItem('ethBalance')
const ethBalanceFormatted = ls && ls.getItem('ethBalanceFormatted')

const initialState = {
  ethBalance: ethBalance || 0,
  ethBalanceFormatted: ethBalanceFormatted || 0
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'ASSETS.SET_ETH_BALANCE': reducers.setEthBalance
}
