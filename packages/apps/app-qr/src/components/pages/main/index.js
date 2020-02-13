import React from 'react'
import { Loading, RetinaImage } from '@linkdrop/ui-kit'
import { actions, translate, platform, detectBrowser } from 'decorators'
import styles from './styles.module'
import QRCode from 'qrcode.react'
import { surveyUrl } from 'app.config.js'
import { getHashVariables } from '@linkdrop/commons'
import { getImages } from 'helpers'

@actions(({
  user: {
    loading,
    error,
    link,
    password
  }
}) => ({
  loading,
  error,
  link,
  password
}))
@platform()
@detectBrowser()
@translate('pages.main')
class Main extends React.Component {
  // componentDidMount () {
  //   const { password } = this.props // password saved in local storage
  //   if (password) {
  //     return this.actions().user.checkPassword({ email })
  //   }
  //   const newPassword = window.prompt(this.t('titles.password'))
  //   if (!newPassword || newPassword == '') {
  //     this.actions().user.setError({ error: 'PASSWORD_SHOULD_BE_PROVIDED' })
  //     alert(this.t('errors.PASSWORD_SHOULD_BE_PROVIDED'))
  //   } else {
  //     this.actions().user.setNewPassword({ password: newPassword, email })
  //   }
  // }

  componentDidMount () {
    const { email } = getHashVariables()
    if (!email) {
      return this.actions().user.setError({ error: 'EMAIL_SHOULD_BE_PROVIDED' })
    }
    this.actions().user.generateLink({ email })
  }

  render () {
    const { context, error, loading, link } = this.props
    return <div className={styles.container}>
      <Loading />
    	{/*<h1 className={styles.title}>{this.t('titles.congrats')}</h1>
    	<h2 className={styles.subtitle}>{this.t('titles.nowClaim', { symbol: 'DAI', amount: 5 })}</h2>
    	<div className={styles.qrCode}>
    		{this.renderQr({ error, loading, link })}
    	</div>
    	<div className={styles.scan} dangerouslySetInnerHTML={{ __html: this.t('titles.scanQR') }} />
    	<div className={styles.startSurvey}>
        <a target='_blank' href={surveyUrl}><RetinaImage width={20} {...getImages({ src: 'reload' })} />{this.t('titles.startNewSurvey')}</a>
      </div>*/}
    </div>
  }

  renderQr ({ error, loading, link }) {
    if (error) {
      return this.t(`errors.${error}`)
    }
    if (loading) {
      return <Loading />
    }
    return <QRCode value={link} size={220} />
  }
}

export default Main
