import React from 'react'
import { Provider } from 'react-redux'
import RouterProvider from './router-provider'
import store from 'data/store'

class Application extends React.Component {
  render () {
    return <Provider store={store()}>
      <RouterProvider />
    </Provider>
  }
}

export default Application
