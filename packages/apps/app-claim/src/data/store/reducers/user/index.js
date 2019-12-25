import reducers from './reducers'

const initialState = {
  id: undefined,
  locale: 'en',
  step: 0,
  loading: false,
  errors: [],
  walletType: null,
  readyToClaim: false,
  alreadyClaimed: false,
  sdk: null,
  sendDataStatus: null
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
  'USER.SET_STEP': reducers.setStep,
  'USER.SET_LOADING': reducers.setLoading,
  'USER.SET_ERRORS': reducers.setErrors,
  'USER.SET_WALLET_TYPE': reducers.setWalletType,
  'USER.SET_READY_TO_CLAIM': reducers.setReadyToClaim,
  'USER.SET_ALREADY_CLAIMED': reducers.setAlreadyClaimed,
  'USER.SET_SDK': reducers.setSdk,
  'USER.SET_SEND_DATA_STATUS': reducers.setSendDataStatus
}
