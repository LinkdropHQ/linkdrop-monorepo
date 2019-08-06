import reducers from './reducers'

const initialState = {
  itemsToClaim: [],
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
  'CONTRACTS_DATA.SET_LOADING': reducers.setLoading,
  'CONTRACTS_DATA.SET_ITEMS_TO_CLAIM': reducers.setItemsToClaim
}
