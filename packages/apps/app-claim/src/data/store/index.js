import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import saga from './saga'
import { createBrowserHistory } from 'history'
import { user, tokens, contract, deeplinks } from './reducers'
const sagaMiddleware = createSagaMiddleware()
export const history = createBrowserHistory()

export default () => {
  const store = createStore(
    combineReducers({
      user,
      tokens,
      contract,
      deeplinks,
      router: connectRouter(history)
    }),
    {},
    compose(
      applyMiddleware(sagaMiddleware),
      applyMiddleware(routerMiddleware(history))
    )
  )
  sagaMiddleware.run(saga)
  return store
}
