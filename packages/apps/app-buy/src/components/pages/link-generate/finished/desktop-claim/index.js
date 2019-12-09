import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import Web3 from 'web3'

@actions(({ user: { claimAddress }, link: { link } }) => ({
  link,
  claimAddress
}))
@translate('pages.linkGenerate')
class ClaimPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      claimAddress: null,
      claimChainId: null
    }
  }

  async componentDidMount () {
    const { web3Provider } = this.props
    const currentProvider = web3Provider && new Web3(web3Provider)
    if (currentProvider) {
      const { accounts, connectorChainId } = await this.getProviderData({ currentProvider })
      this.setState({
        claimAddress: accounts[0],
        claimChainId: connectorChainId
      })
    }
  }

  async getProviderData ({ currentProvider }) {
    const accounts = await currentProvider.eth.getAccounts()
    // const connectorChainId = await currentProvider.eth.getChainId()
    const connectorChainId = '3'
    return { accounts, connectorChainId }
  }

  render () {
    const { link } = this.props
    const { claimAddress, claimChainId } = this.state
    if (!claimAddress || !claimChainId) {
      return null
    }
    return <div className={styles.claimContainer}>
      <iframe
        frameBorder='0'
        height='100%'
        src={`${link}&externalAccount=${claimAddress}&externalChainId=${claimChainId}&hideLayout=true`}
        width='100%'
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
  }
}

export default ClaimPage
