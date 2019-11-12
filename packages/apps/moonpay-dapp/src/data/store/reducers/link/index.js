import reducers from './reducers'

const initialState = {
  loading: false,
  link: null,
  page: 'process'
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
