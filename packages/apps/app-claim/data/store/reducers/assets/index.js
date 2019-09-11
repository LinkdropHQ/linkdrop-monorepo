import reducers from './reducers'

const initialState = {
  itemsToClaim: [],
  items: null,
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
