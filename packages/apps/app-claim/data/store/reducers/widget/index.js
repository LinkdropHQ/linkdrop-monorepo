import reducers from './reducers'
import EventEmitter from 'events'

const initialState = {
  page: null,
  txParams: null,
  // connected to dapp, possible to use widget inside of dapp
  connected: false,
  eventEmitter: new EventEmitter(),
  started: false,
  communication: null
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'WIDGET.SET_PAGE': reducers.setPage,
  'WIDGET.SET_CONNECTED': reducers.setConnected,
  'WIDGET.SET_TX_PARAMS': reducers.setTxParams,
  'WIDGET.SET_STARTED': reducers.setStarted,
  'WIDGET.SET_COMMUNICATION': reducers.setCommunication
}
