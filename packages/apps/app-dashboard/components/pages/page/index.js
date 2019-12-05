import React from 'react'
import styles from './styles.module'
import { Aside, Header } from 'components/common'
import { translate, actions } from 'decorators'
import { Scrollbars } from 'react-custom-scrollbars'
import Web3Injector from './web3-injector'
import { Loading } from '@linkdrop/ui-kit'
import NetworkNotSupported from './network-not-supported'
import { defineNetworkName } from '@linkdrop/commons'
const ls = window.localStorage

@actions(({ user: { currentAddress, chainId, loading, step, web3Provider } }) => ({ loading, currentAddress, chainId, step, web3Provider }))
@translate('pages.page')
class Page extends React.Component {
  componentDidMount () {
    const { web3Provider } = this.props
    if (web3Provider) {
      this.actions().user.checkCurrentProvider({ provider: web3Provider })
    }
  }

  defineContent ({ currentAddress }) {
    const { chainId, loading, web3Provider } = this.props
    if (!web3Provider) {
      return <Web3Injector />
    }
    if (currentAddress === null && loading) {
      return <Loading />
    }
    if (!defineNetworkName({ chainId })) {
      return <NetworkNotSupported />
    }
    return this.props.children
  }

  render () {
    const { currentAddress, step } = this.props
    const content = this.defineContent({ currentAddress })
    return <div className={styles.container}>
      <div className={styles.easterEgg} onClick={_ => this.emptyLs()} />
      <Aside />
      <div className={styles.mainWrapper}>
        <Scrollbars style={{
          heigth: '100%',
          width: '100%'
        }}
        >
          <div className={styles.main}>
            <Header step={step} />
            {content}
          </div>
        </Scrollbars>
      </div>
    </div>
  }

  emptyLs () {
    ls && ls.removeItem('campaigns')
    ls && ls.removeItem('proxyAddr')
    ls && ls.removeItem('privateKey')
    window.location.reload()
  }
}

export default Page
