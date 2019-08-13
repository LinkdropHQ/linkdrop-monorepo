import React from 'react'
import { Provider } from 'react-redux'
import RouterProvider from './router-provider'
import Authorization from './authorization'
import { getHashVariables } from '@linkdrop/commons'
import store from 'data/store'

class Application extends React.Component {
  componentDidMount () {
    const {
      chainId
    } = getHashVariables()
    this.actions().user.createSdk({ chainId })
  }

  render () {
    return <Authorization />
    return <Provider store={store()}>
      <RouterProvider />
    </Provider>
  }
}
export default Application
