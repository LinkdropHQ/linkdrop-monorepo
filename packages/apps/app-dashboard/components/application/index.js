import React from 'react'
import { Provider } from 'react-redux'
import RouterProvider from './router-provider'
import { platform } from 'decorators'
import store from 'data/store'
import MobileDisabled from './mobile-disabled'
import { linksLimit } from 'app.config.js'

@platform()
class Application extends React.Component {
  render () {
    if (this.platform === 'ios' || this.platform === 'android') {
      return <MobileDisabled />
    }
    return <Provider store={store()}>
      <RouterProvider />
    </Provider>
  }
}
export default Application
