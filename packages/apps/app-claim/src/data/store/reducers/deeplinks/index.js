import reducers from './reducers'

const initialState = {
  coinbaseLink: undefined
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'DEEPLINKS.SET_COINBASE_LINK': reducers.setCoinbaseLink
}
