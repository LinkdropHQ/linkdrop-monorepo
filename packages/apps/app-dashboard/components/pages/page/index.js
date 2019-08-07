/* global web3 */
import React from 'react'
import styles from './styles.module'
import { Aside, Header } from 'components/common'
import { translate, actions } from 'decorators'
import { Scrollbars } from 'react-custom-scrollbars'
import MetamaskInjector from './metamask-injector'
import { Loading } from '@linkdrop/ui-kit'
import NetworkNotSupported from './network-not-supported'
let web3Obj
const ls = window.localStorage
try {
  web3Obj = web3
} catch (e) {
  web3Obj = null
}

@actions(({ user: { currentAddress, chainId, loading, step } }) => ({ loading, currentAddress, chainId, step }))
@translate('pages.page')
class Page extends React.Component {
  componentDidMount () {
    if (web3Obj) {
      this.actions().user.checkCurrentProvider()
    }
  }

  defineContent ({ currentAddress }) {
    const { chainId, loading } = this.props
    if (!web3Obj) {
      return <MetamaskInjector />
    }
    if (currentAddress === null && loading) {
      return <Loading />
    }
    if (!currentAddress) {
      return <MetamaskInjector />
    }
    if (Number(chainId) !== 4 && Number(chainId) !== 1) {
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
        }}>
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
