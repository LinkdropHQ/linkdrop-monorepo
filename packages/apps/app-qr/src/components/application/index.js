import React from 'react'
import { Provider } from 'react-redux'
import Router from './router'
import store from 'data/store'

class Application extends React.Component {
  render () {
    return <Provider store={store()}>
      <Router />
    </Provider>
  }
}
export default Application
