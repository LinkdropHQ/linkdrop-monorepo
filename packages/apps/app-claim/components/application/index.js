import React from 'react'
import { Provider } from 'react-redux'
import RouterProvider from './router-provider'
import { action } from 'decorators'
import Authorization from './authorization'
import { getHashVariables } from '@linkdrop/commons'
import { Loading } from '@linkdrop/ui-kit'
import store from 'data/store'

@action(({ user: { sdk, loading, privateKey, contractAddress, ens } }) => ({ sdk, contractAddress, privateKey, ens }))
class Application extends React.Component {
  componentDidMount () {
    const {
      chainId
    } = getHashVariables()
    this.actions().user.createSdk({ chainId })
  }

  render () {
    const { sdk, privateKey, contractAddress, ens } = this.props
    // пока нет сдк
    if (!sdk) {
      return <Loading />
    }
    // сдк
    if (sdk && (!ens || !privateKey || !contractAddress)) {
      return <Authorization />
    }
    if (privateKey && contractAddress && ens) {
      return <Provider store={store()}>
        <RouterProvider />
      </Provider>
    }
  }
}
export default Application
