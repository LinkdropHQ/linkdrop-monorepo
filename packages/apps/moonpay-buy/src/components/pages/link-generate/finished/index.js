import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { Button } from 'components/common'
import { PageExpandable } from 'components/pages'
import QRCode from 'qrcode.react'
import { Icons } from '@linkdrop/ui-kit'
import { copyToClipboard, definePlatform } from '@linkdrop/commons'
import variables from 'variables'
import DesktopClaimOptions from './desktop-claim-options'
import MobileClaimOptions from './mobile-claim-options'

@actions(({ assets: { ethBalanceFormatted }, link: { link, minifiedLink } }) => ({
  link,
  minifiedLink,
  ethBalanceFormatted
}))
@translate('pages.linkGenerate')
class Finished extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      qrExpanded: false,
      optionsExpanded: false
    }
  }

  render () {
    const { qrExpanded, optionsExpanded } = this.state
    const { link, ethBalanceFormatted, minifiedLink } = this.props
    return <div className={styles.container}>
      {this.renderQR({ expanded: qrExpanded, link: minifiedLink })}
      {this.renderClaimOptions({ optionsExpanded })}
      <div className={styles.title}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.linkIsReady', {
            amount: ethBalanceFormatted || 0,
            symbol: 'ETH'
          })
        }}
      />
      <div className={styles.subtitle}>{this.t('titles.instruction')}</div>
      <Button
        className={styles.button}
        onClick={_ => {
          this.setState({ optionsExpanded: true })
        }}
      >
        {this.t('buttons.claimInWallet')}
      </Button>
      <Button
        inverted
        className={styles.iconedButton}
        onClick={_ => {
          this.setState({ qrExpanded: true })
        }}
      >
        <Icons.Qr />
        {this.t('buttons.share')}
      </Button>
    </div>
  }

  renderClaimOptions ({ optionsExpanded }) {
    const platform = definePlatform()
    const commonProps = {
      expanded: optionsExpanded,
      onChange: ({ expanded }) => {
        this.setState({
          optionsExpanded: expanded
        })
      },
      translate: this.t
    }
    if (platform === 'desktop') { return <DesktopClaimOptions {...commonProps} /> }
    return <MobileClaimOptions {...commonProps} />
  }

  renderQR ({ expanded, link }) {
    return <PageExpandable
      expanded={expanded}
      fullContent
      onClose={_ => this.setState({
        qrExpanded: false
      })}
    >
      {link && <div className={styles.qr}>
        <QRCode size={132} value={link} />
      </div>}
      <div className={styles.qrContent}>
        <div className={styles.qrSubtitle}>{this.t('titles.scan')}</div>
        <div className={styles.link}>
          {link}
        </div>
      </div>
      <Button onClick={_ => copyToClipboard({ value: link })}>{this.t('buttons.copy')}</Button>
    </PageExpandable>
  }

  
}

export default Finished
