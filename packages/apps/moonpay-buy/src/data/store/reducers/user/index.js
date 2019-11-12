import reducers from './reducers'

const initialState = {
  id: undefined,
  locale: 'en',
  wallet: null,
  privateKey: null,
  sdk: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'USER.SET_LOCALE': reducers.setLocale,
  'USER.SET_WALLET': reducers.setWallet,
  'USER.SET_PRIVATE_KEY': reducers.setPrivateKey,
  'USER.SET_SDK': reducers.setSdk
}
