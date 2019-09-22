import React from 'react'
import { Authorization } from 'components/pages'
// import './styles'
import { Loading } from '@linkdrop/ui-kit'
import ConnectScreen from 'components/pages/widget/dapp-connect'
import ConfirmTransactionScreen from 'components/pages/widget/dapp-confirm'
import { actions } from 'decorators'
import AppRouter from '../router'
import { getHashVariables } from '@linkdrop/commons'
import widgetService from 'data/api/widget'
import config from 'app.config.js'

@actions(({ user: { sdk, loading, privateKey, contractAddress, ens, locale } }) => ({
  sdk,
  loading,
  privateKey,
  contractAddress,
  ens,
  locale
}))
class WidgetRouter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      screen: null,
      txParams: null,
      connected: false
    }
  }

  async componentDidMount () {
    const { sdk } = this.props
    if (!sdk) {
      const {
        chainId = config.defaultChainId
      } = getHashVariables()
      this.actions().user.createSdk({ chainId })
    }

    // Methods child is exposing to parent
    const component = this
    const methods = {
      sendTransaction: async (txParams) => {
        this.setState({
          screen: 'CONFIRM_TRANSACTION_SCREEN',
          txParams
        })
        return this._awaitUserTransactionConfirmation()
      },
      connect: (ensName) => {
        this.setState({ screen: 'CONNECT_SCREEN' })
        return this._awaitUserConnectConfirmation()
      },
      getAccounts () {
        const contractAddress = component._getContractAddress()
        return [contractAddress]
      }
    }

    widgetService.connectToDapp({ methods })
  }

  _getContractAddress () {
    const { contractAddress } = this.props
    return contractAddress
  }

  _awaitUserTransactionConfirmation () {
    return new Promise(async (resolve, reject) => {
      widgetService.showWidget()

      // wait for user input
      widgetService.eventEmitter.on('userAction', ({ action, payload }) => {
        widgetService.hideWidget()

        // resolve or reject
        if (action === 'confirm') {
          resolve(payload)
        } else { // on close click
          reject(new Error('User rejected action'))
        }

        setTimeout(() => {
          this.setState({ screen: null })
        }, 500)
      })
    })
  }

  _awaitUserConnectConfirmation () {
    return new Promise(async (resolve, reject) => {
      // wait for user input
      widgetService.eventEmitter.on('userAction', ({ action, payload }) => {
        // resolve or close modal
        if (action === 'confirm') {
          resolve(payload)
          setTimeout(() => {
            this.setState({ screen: null, connected: true })
          }, 500)

          // hide widget if it's not a claim link
          if (window.location.hash.indexOf('/receive') === -1) {
            widgetService.hideWidget()
          }
        } else { // on close click
          widgetService.hideWidget()
        }
      })
    })
  }

  render () {
    const { sdk, privateKey, contractAddress, ens } = this.props
    if (!sdk) {
      return <Loading />
    }

    // sdk
    if (sdk && (!ens || !privateKey || !contractAddress)) {
      return <Authorization />
    }

    if (this.state.connected && !this.state.screen) return this._renderAppRouter()

    if (this.state.screen === 'CONNECT_SCREEN') {
      return <ConnectScreen />
    }

    if (this.state.screen === 'CONFIRM_TRANSACTION_SCREEN') {
      return <ConfirmTransactionScreen txParams={this.state.txParams} />
    }

    return this._renderAppRouter()
  }

  _renderAppRouter () {
    // rendering wallet router
    return <AppRouter />
  }
}

export default WidgetRouter
