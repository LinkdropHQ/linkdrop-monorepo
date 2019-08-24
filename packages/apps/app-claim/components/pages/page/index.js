import React from 'react'
import { Header, Footer, RetinaImage } from '@linkdrop/ui-kit'
import { WalletHeader, MoonpayWidget } from 'components/common'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import text from 'texts'
import { getImages } from 'helpers'

@actions(({ user: { moonpayShow } }) => ({ moonpayShow }))
@translate('pages.page')
class Page extends React.Component {
  render () {
    const { dynamicHeader, moonpayShow } = this.props
    return <div className={styles.container}>
      {dynamicHeader ? <WalletHeader /> : <Header title={this.t('titles.getTokens')} />}
      <div className={styles.main}>
        {this.props.children}
      </div>
      <Footer
        content={<a href='https://t.me/LinkdropHQ' target='_blank'><RetinaImage width={138} {...getImages({ src: 'footer-image' })} /></a>}
      />
      {moonpayShow && <MoonpayWidget onClose={_ => this.actions().user.setMoonpayShow({ moonpayShow: false })} />}
    </div>
  }
}

export default Page
