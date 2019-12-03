import React from 'react'
import { Page } from 'components/pages'
import { Loading } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module.scss'
import { defineEtherscanUrl } from '@linkdrop/commons'

@actions(({ user: { proxyAddress } }) => ({ proxyAddress }))
@translate('pages.loading')
class LoadingScreen extends React.Component {
  render () {
  	const { proxyAddress } = this.props
  	const etherscanHost = defineEtherscanUrl({ chainId: '3' })
    return <Page>
	    <div>
	      <Loading size='small' className={styles.loading}/>
	      <div className={styles.title}>{this.t('titles.processing')}</div>
	      <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('texts.description') }}/>
	    	<a href={`${etherscanHost}address/${proxyAddress}`} className={styles.link}>{this.t('texts.details')}</a>
	    </div>
    </Page>
  }
}

export default LoadingScreen
