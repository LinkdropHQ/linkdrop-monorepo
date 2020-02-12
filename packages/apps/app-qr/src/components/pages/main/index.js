import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import { actions, translate, platform, detectBrowser } from 'decorators'
import styles from './styles.module'
import QRCode from 'qrcode.react'

@actions(({}) => ({}))
@platform()
@detectBrowser()
@translate('pages.main')
class Main extends React.Component {
  render () {
    const { context } = this.props
    return <div>
    	<h1 className={styles.title}>{this.t('titles.congrats')}</h1>
    	<h2 className={styles.subtitle}>{this.t('titles.nowClaim', { symbol: 'DAI', amount: 5 })}</h2>
    	<div className={styles.qrCode}>
    		<QRCode value='http://google.com' size={220} />
    	</div>
    	<div className={styles.scan} dangerouslySetInnerHTML={{ __html: this.t('titles.scanQR') }} />
    	<div className={styles.startSurvey}>{this.t('titles.startNewSurvey')}</div>
    </div>
  }
}

export default Main
