import reducers from './reducers'
// const ls = window.localStorage

const initialState = {
  id: undefined,
  locale: 'en',
  loading: true,
  error: null,
  link: null
  // password: ls && ls.getItem && ls.getItem('password')
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'USER.CHANGE_LOCALE': reducers.changeLocale,
  'USER.SET_LOADING': reducers.setLoading,
  'USER.SET_ERROR': reducers.setError,
  'USER.SET_LINK': reducers.setLink,
  'USER.SET_PASSWORD': reducers.setPassword
}
