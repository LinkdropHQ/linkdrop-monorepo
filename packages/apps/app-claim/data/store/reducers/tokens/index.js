import reducers from './reducers'

const initialState = {
  loading: false,
  link: '',
  transactionStatus: null,
  transactionId: null,
  transactionData: {}
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'TOKENS.SET_LINK': reducers.setLink,
  'TOKENS.SET_LOADING': reducers.setLoading,
  'TOKENS.SET_TRANSACTION_STATUS': reducers.setTransactionStatus,
  'TOKENS.SET_TRANSACTION_ID': reducers.setTransactionId,
  'TOKENS.SET_TRANSACTION_DATA': reducers.setTransactionData
}
