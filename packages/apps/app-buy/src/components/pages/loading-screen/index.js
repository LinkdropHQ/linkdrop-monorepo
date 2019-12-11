import React from 'react'
import { Page } from 'components/pages'
import { Loading } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module.scss'
import { defineEtherscanUrl, getHashVariables } from '@linkdrop/commons'

@actions(({
	assets: {
		ethBalance
	},
	user: {
		proxyAddress,
		application
	}
}) => ({
	ethBalance,
	proxyAddress,
	application
}))
@translate('pages.loading')
class LoadingScreen extends React.Component {

	componentDidMount () {
		const { generateLink, application } = this.props
	  generateLink && this.actions().link.createLink()
	  if (!generateLink && application === 'sendwyre') {
	  	window.setTimeout(_ => this.applyBalanceCheck(), 3000)
	  }
	}

  componentWillReceiveProps ({ ethBalance, application }) {
  	if (application !== 'sendwyre') { return }
    const {
      ethBalance: prevEthBalance
    } = this.props

    if (!prevEthBalance && ethBalance) {
      if (window.balanceCheck) {
        window.clearInterval(window.balanceCheck)
        window.location.href = '/#/link-generate'
      }
    }
  }

	applyBalanceCheck () {
    if (window.balanceCheck) { window.clearInterval(window.balanceCheck) }
    window.balanceCheck = window.setInterval(_ => {
      this.actions().assets.checkBalance()
    }, 3000)
  }

  render () {
  	const etherscanHost = defineEtherscanUrl({ chainId: '3' })
  	const { proxyAddress: proxyAddressFromUrl } = getHashVariables()
  	const { title = this.t('titles.processing'), proxyAddress } = this.props

    return <Page>
	    <div>
	      <Loading size='small' className={styles.loading}/>
	      <div className={styles.title}>{title}</div>
	      <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('texts.description') }}/>
	    	<a target='_blank' href={`${etherscanHost}address/${proxyAddress || proxyAddressFromUrl}`} className={styles.link}>{this.t('texts.details')}</a>
	    </div>
    </Page>
  }
}

export default LoadingScreen
